// upload-test.component.ts
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MinioService } from '../../services/minio.service';
import { CommonModule } from '@angular/common';

interface UploadSession {
  controller: AbortController;
  objectName: string;
  uploadId: string;
  selectedFile?: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed' | 'aborted';
}

@Component({
  selector: 'app-upload-test',
  standalone: true, // ถ้าเป็น standalone component
  imports: [CommonModule], // เพิ่มตรงนี้เพื่อใช้ *ngIf, *ngFor
  templateUrl: './upload-test.component.html',
})
export class UploadTestComponent {
  selectedFile?: File;
  uploadMessage = '';

  currentUpload: UploadSession[] = [];

  constructor(
    private minioService: MinioService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // init ตัวแรก
    this.addUploader();
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.currentUpload[index].selectedFile = file;
    }
  }

  async onUpload(event: Event, index: number): Promise<void> {
    event.preventDefault();

    const file = this.currentUpload[index].selectedFile;
    if (!file) return;

    const chunkSize = 5 * 1024 * 1024; // 5MB
    const totalParts = Math.ceil(file.size / chunkSize);
    const percentage = 90 / totalParts;
    try {
      // 1. Initiate upload
      const initiateRes = await this.minioService
        .uploadMultipart(file)
        .toPromise();
      const { uploadId, objectName } = await initiateRes.payload;

      // เก็บข้อมูลการ upload ปัจจุบัน
      this.currentUpload[index] = {
        ...this.currentUpload[index],
        objectName,
        uploadId,
        progress: 5,
        status: 'uploading',
      };

      // ตรวจสอบว่า abort หรือยัง
      if (this.currentUpload[index].controller.signal.aborted) {
        throw new Error('Upload aborted');
      }

      // 2. Get presigned URL
      const presignedUrlRes = await this.minioService
        .getPresignedUrls(objectName, uploadId, totalParts)
        .toPromise();
      const parts = await presignedUrlRes.payload;

      const completedParts: {
        partNumber: number;
        etag: any;
      }[] = [];

      // 3. Upload chunks with abort support
      await Promise.all(
        parts.map(
          async (part: { presignedUrl: string | URL | Request }, i: number) => {
            // ตรวจสอบ abort signal ก่อน upload แต่ละ chunk
            if (this.currentUpload[index].controller.signal.aborted) {
              throw new Error('Upload aborted');
            }

            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);

            const response = await fetch(part.presignedUrl, {
              method: 'PUT',
              body: chunk,
              signal: this.currentUpload[index].controller.signal, // เพิ่ม abort signal ให้ fetch
            });

            const etag = response.headers.get('etag');

            completedParts.push({
              partNumber: i + 1,
              etag,
            });

            // เพิ่ม percentage ของการ uopload
            this.currentUpload[index] = {
              ...this.currentUpload[index],
              progress: this.currentUpload[index].progress + percentage,
            };
          }
        )
      );

      // ตรวจสอบ abort อีกครั้งก่อน complete
      if (this.currentUpload[index].controller.signal.aborted) {
        throw new Error('Upload aborted');
      }

      // 4. Complete upload
      this.minioService
        .completeMultipartUpload(objectName, uploadId, completedParts)
        .toPromise()
        .then(() => {
          // เพิ่ม percentage ของการ uopload
          this.currentUpload[index] = {
            ...this.currentUpload[index],
            status: 'completed',
            progress: 100,
          };
        });
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message === 'Upload aborted') {
        console.log('🔄 Upload aborted, cleaning up...');
        await this.abortUpload(index);
      } else {
        console.error('❌ Upload failed', error);
        // ยังคง abort เพื่อ cleanup
        await this.abortUpload(index);
      }
      throw error;
    }
  }

  async abortUpload(index: number): Promise<void> {
    if (!this.currentUpload[index]) {
      console.log('No active upload to abort');
      return;
    }

    const { controller, objectName, uploadId } = this.currentUpload[index];

    try {
      // 1. Abort ongoing requests
      controller.abort();

      // 2. Call abort API to cleanup on server
      await this.minioService.abortUpload(objectName, uploadId).toPromise();
      console.log('✅ Upload aborted and cleaned up');
    } catch (error) {
      console.error('❌ Error during abort:', error);
    } finally {
      // เพิ่ม percentage ของการ uopload
      this.currentUpload[index] = {
        ...this.currentUpload[index],
        status: 'failed',
        progress: 0,
      };
    }
  }

  addUploader(): void {
    this.currentUpload.push({
      controller: new AbortController(),
      objectName: '',
      uploadId: '',
      progress: 0,
      status: 'pending',
      selectedFile: undefined,
    });
  }
}
