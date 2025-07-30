import { Component } from '@angular/core';
import { MinioService } from '../../services/minio.service';
import { FormsModule } from '@angular/forms'; // <-- this is needed

@Component({
  selector: 'app-presigned-url',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './presigned-url.component.html',
  styleUrl: './presigned-url.component.css',
})
export class PresignedUrlComponent {
  fileName: string = '';
  presignedUrl: string = '';

  constructor(private minioService: MinioService) {}

  onClickPresignedDownload(event: Event) {
    event.preventDefault(); // ป้องกันหน้ารีเฟรช

    this.minioService
      .getPresignedUrlsForDownload(this.fileName)
      .subscribe((res: any) => {
        console.log(res.data);
        // ใช้ window.open เพื่อดาวน์โหลด
        window.open(res.data, '_blank');
        this.presignedUrl = res.data;
      });
  }

  // your-component.ts

  startDownload(objectName: string) {
    this.minioService.getPresignedUrlsForDownload(objectName).subscribe({
      next: (url) => {
        // สมมุติคุณรู้ขนาดไฟล์ (total size) ด้วย — หรือจะไปดึงด้วย HEAD ก็ได้
        const totalFileSize = 35 * 1024 * 1024; // 35MB (สมมุติ)
        this.minioService.downloadFileInChunks(url, totalFileSize, objectName);
      },
      error: (err) => {
        console.error('Failed to get presigned URL', err);
      },
    });
  }
}
