import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_PATH } from '../constants/api-path';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../../../tokens/api-base-url.token';

@Injectable({
  providedIn: 'root',
})
export class MinioService {
  private http = inject(HttpClient);
  private baseUrl = inject(API_BASE_URL);

  constructor() {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/${API_PATH.MINIO.UPLOAD}`, formData);
  }

  getPresignedUrl(fileName: string): Observable<any> {
    const params = new HttpParams().set('fileName', fileName);
    return this.http.get(
      `${this.baseUrl}/${API_PATH.MINIO.PRESIGNED_DOWNLOAD}`,
      { params }
    );
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

  getPresignedUrls(
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
