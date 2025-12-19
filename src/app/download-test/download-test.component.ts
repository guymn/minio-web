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
    this.minioService.downloadFile(
      '',
      '/cpi/e-contract/SSO AD.pdf'
    );
  }
}
