import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_PATH } from '../constants/api-path';

@Injectable({
  providedIn: 'root',
})
export class CkService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8417/egp-cpi09-service';
  constructor() {}

  fillTemplate(file: File, params: Record<string, string>) {
    const formData = new FormData();
    formData.append('templateHtml', file); // key ต้องตรงกับ @RequestPart
    formData.append('param', JSON.stringify(params));

    return this.http.post(
      `${this.baseUrl}/${API_PATH.CK.FILL_TEMPLETE}`,
      formData,
      {
        responseType: 'blob', // เพราะ backend ส่ง byte[] กลับมาเป็นไฟล์
      }
    );
  }
}
