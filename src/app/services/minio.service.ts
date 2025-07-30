import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_PATH } from '../constants/api-path';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../../../tokens/api-base-url.token';
interface DownloadProgress {
  loadedChunks: number;
  totalChunks: number;
  progressPercent: number; // 0 - 100
}
@Injectable({
  providedIn: 'root',
})
export class MinioService {
  private http = inject(HttpClient);
  private baseUrl = inject(API_BASE_URL);
  readonly CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk

  constructor() {}

  getPresignedUrlsForDownload(objectName: string): Observable<any> {
    const params = new HttpParams().set('objectName', objectName);
    return this.http.get(
      `${this.baseUrl}/${API_PATH.MINIO.PRESIGNED_DOWNLOAD}`,
      { params }
    );
  }

  downloadFileInChunks(
    presignedUrl: string,
    totalSize: number,
    fileName: string
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const chunksCount = Math.ceil(totalSize / this.CHUNK_SIZE);
      const fileChunks: Blob[] = [];

      const downloadChunk = (index: number) => {
        const start = index * this.CHUNK_SIZE;
        const end = Math.min(start + this.CHUNK_SIZE - 1, totalSize - 1);
        const headers = new HttpHeaders().set('Range', `bytes=${start}-${end}`);

        this.http
          .get(presignedUrl, { headers, responseType: 'blob' })
          .subscribe({
            next: (blob) => {
              fileChunks[index] = blob;

              if (index + 1 < chunksCount) {
                downloadChunk(index + 1);
              } else {
                // รวมทุก chunk แล้วโหลด
                const fullBlob = new Blob(fileChunks);
                const link = document.createElement('a');
                link.href = URL.createObjectURL(fullBlob);
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(link.href);

                resolve();
              }
            },
            error: (err) => {
              console.error(`Chunk ${index + 1} failed`, err);
              reject();
            },
          });
      };

      // เริ่มโหลด chunk แรก
      downloadChunk(0);
    });
  }

  getList(objectKey: string): Observable<any> {
    const params = new HttpParams().set('objectKey', objectKey);
    return this.http.get(`${this.baseUrl}/${API_PATH.MINIO.LIST}`, { params });
  }

  uploadMultipart(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('objectName', file.name);
    formData.append('contentType', file.type);
    return this.http.post(
      `${this.baseUrl}/${API_PATH.MINIO.INITIATE_UPLOAD_ID}`,
      formData
    );
  }

  getPresignedUrlsForUpload(
    objectName: string,
    uploadId: string,
    totalParts: number
  ): Observable<any> {
    const formData = new FormData();
    formData.append('objectName', objectName);
    formData.append('uploadId', uploadId);
    formData.append('totalParts', totalParts + '');

    return this.http.post(
      `${this.baseUrl}/${API_PATH.MINIO.PRESIGNED_URLS}`,
      formData
    );
  }

  completeMultipartUpload(
    objectName: string,
    uploadId: string,
    parts: any[]
  ): Observable<any> {
    const body = {
      objectName,
      uploadId,
      parts,
    };

    return this.http.post(
      `${this.baseUrl}/${API_PATH.MINIO.COMPLETE_MULTIPART_UPLOAD}`,
      body
    );
  }

  abortUpload(objectName: string, uploadId: string): Observable<any> {
    const params = new HttpParams()
      .set('uploadId', uploadId)
      .set('objectName', objectName);
    return this.http.delete(
      `${this.baseUrl}/${API_PATH.MINIO.ABORT_MULTIPART_UPLOAD}`,
      { params }
    );
  }
}
