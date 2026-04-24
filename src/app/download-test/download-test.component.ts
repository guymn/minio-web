import { Component } from '@angular/core';
import { MinioService } from '../services/minio.service';
import { CommonModule } from '@angular/common';

interface file {
  key: string;
  size: number;
  versionId: number;
  isLatest: boolean;
  lastModified: Date;
}

@Component({
  selector: 'app-download-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download-test.component.html',
  styleUrl: './download-test.component.css',
})
export class DownloadTestComponent {
  fileList: file[] = [];
  isLoadingList: boolean[] = [];
  cf2900d7: any;

  constructor(private minioService: MinioService) {
    // this.getFileList('');
  }

  // getFileList(objectKey: string) {
  //   this.minioService.getList(null, 0, 10).subscribe({
  //     next: (res) => {
  //       this.fileList = res.payload;
  //     },
  //     error: (err) => {
  //       console.error('Failed to get file list', err);
  //     },
  //   });
  // }

  // startDownload(index: number) {
  //   const { key, size } = this.fileList[index];
  //   this.isLoadingList[index] = true;

  //   this.minioService.getPresignedUrlsForDownload(key).subscribe({
  //     next: (res) => {
  //       this.minioService
  //         .downloadFileInChunks(res.payload, size, key)
  //         .finally(() => {
  //           this.isLoadingList[index] = false;
  //         });
  //     },
  //     error: (err) => {
  //       console.error('Failed to get presigned URL', err);
  //     },
  //   });
  // }

  download() {
    const fileId: string = '0fc693af-54df-47da-ac73-79ecabbf21cc';
    this.minioService.downloadFile(fileId);
  }

  downloadSteam() {
    let fileId: string = 'f33ebe34-adcf-4b40-87f7-7cab430b9a97';
    this.minioService.downloadStreamFile(fileId).subscribe((res) => {
      const blob = res.body as Blob;

      const contentDisposition = res.headers.get('Content-Disposition');
      let fileName = 'downloaded-file';

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.length === 2) {
          fileName = match[1];
        }
      }

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName; // ตั้งชื่อเอง หรือดึงจาก header
      a.click();

      window.URL.revokeObjectURL(url);
    });
  }
}
