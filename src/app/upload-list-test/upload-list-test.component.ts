import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  CompleteUploadListRequest,
  CompleteUploadRequest,
  InitiateUploadDto,
  PartInfo,
  PresignedUrlDto,
  UploadSessionDto,
  UploadSessionResponse,
} from '../model/model';
import { MinioService } from '../services/minio.service';
import { PuppeteerService } from '../services/puppeteer.service';

@Component({
  selector: 'app-upload-list-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-list-test.component.html',
  styleUrl: './upload-list-test.component.css',
})
export class UploadListTestComponent {
  selectedFiles: File[] = [];

  constructor(
    private minioService: MinioService,
    private puppeteerService: PuppeteerService
  ) {}

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = [...this.selectedFiles, ...Array.from(input.files)];
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1); // ลบไฟล์ออก
  }

  onUploadAll(event: Event): void {
    event.preventDefault();

    const chunkSize = 5 * 1024 * 1024; // 5MB

    const body: UploadSessionDto = {
      sessionId: null, // หรือใส่ id ถ้ามี
      fileList: this.selectedFiles.map((file) => ({
        fileName: file.name,
        contentType: file.type,
        countPart: Math.ceil(file.size / chunkSize),
        sizeBytes: file.size,
      })),
    };

    // ส่งไป backend

    this.minioService.getPresignedUrlsForUploadList(body).subscribe({
      next: async (res) => {
        const data: UploadSessionResponse = res.payload;
        const completeReq: CompleteUploadListRequest = {
          sessionId: data.sessionId,
          uploadList: [],
        };
        // รอทุกไฟล์ upload เสร็จหมด
        await Promise.all(
          data.initiateUploadList.map(
            async (upload: InitiateUploadDto, i: number) => {
              const file: File = this.selectedFiles[i];
              const uploadReq: CompleteUploadRequest = {
                fileId: upload.fileId,
                objectName: upload.objectName,
                uploadId: upload.uploadId,
                parts: [],
              };

              await Promise.all(
                upload.presignedUrlList.map(
                  async (part: PresignedUrlDto, j: number) => {
                    const partInfo: PartInfo = {
                      partNumber: part.partNumber,
                      etag: '',
                    };

                    //แบ่ง part
                    const start = j * chunkSize;
                    const end = Math.min(start + chunkSize, file.size);
                    const chunk = file.slice(start, end);

                    //use presign url
                    // const presign = part.presignedUrl.replace(
                    //   'http://minio-hl.minio-system.svc.cluster.local:9000',
                    //   'https://minio-https.apps.egpms.pccth.com'
                    // );
                    const response = await fetch(part.presignedUrl, {
                      method: 'PUT',
                      body: chunk,
                    });

                    const etag: string = response.headers.get('etag') + '';

                    uploadReq.parts.push({
                      partNumber: j + 1,
                      etag,
                    });
                  }
                )
              );

              completeReq.uploadList.push(uploadReq);
            }
          )
        );

        // เรียก completeUploadList หลังทุก part ของทุกไฟล์เสร็จ
        this.minioService.completeUploadList(completeReq).subscribe({
          next: (r) => console.log('Upload completed:', r),
          error: (err) => console.error(err),
        });
      },
      error: (err) => console.error('Error:', err),
    });
  }
}
