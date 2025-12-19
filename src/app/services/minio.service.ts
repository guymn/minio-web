import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_PATH } from '../constants/api-path';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../../../tokens/api-base-url.token';
import { CompleteUploadListRequest, UploadSessionDto } from '../model/model';
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
  private baseUrl = 'http://localhost:8412/egp-cobj01-service';
  // private baseUrl = 'http://sdtest.apps.egpms.pccth.com/egp-cobj01-service';
  // private baseUrl = 'https://process5.apps.egpms.pccth.com/egp-cpi09-service';

  readonly CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk

  constructor() {}

  getPresignedUrlsForDownload(objectName: string): Observable<any> {
    const params = new HttpParams().set('objectName', objectName);
    return this.http.get(
      `${this.baseUrl}/${API_PATH.MINIO.PRESIGNED_DOWNLOAD}`,
      { params }
    );
  }

  downloadFile(presignedUrl: string, fileName: string): void {
    this.http.get(presignedUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(blobUrl);
        console.log(`✅ Downloaded: ${fileName}`);
      },
      error: (err) => {
        console.error('❌ Download failed:', err);
      },
    });
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

  getList(
    sessionId: string | null,
    page: number,
    size: number
  ): Observable<any> {
    let params = new HttpParams();
    if (sessionId) {
      params = params.set('sessionId', sessionId);
    }
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());
    return this.http.get(`${this.baseUrl}/${API_PATH.MINIO.LIST}`, { params });
  }

  uploadMultipart(objectName: any, contentType: any): Observable<any> {
    const formData = new FormData();
    formData.append('objectName', objectName);
    formData.append('contentType', contentType);
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

  getPresignedUrlsForUploadList(session: UploadSessionDto): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${API_PATH.MINIO.PRESIGNED_URLS_LIST}`,
      session
    );
  }

  completeUploadList(request: CompleteUploadListRequest): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${API_PATH.MINIO.COMPLETE_UPLOAD_LIST}`,
      request
    );
  }
}
