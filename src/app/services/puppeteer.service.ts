import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_PATH } from '../constants/api-path';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PuppeteerService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';
  constructor() {}

  convertHtmlToPdf(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(
      `${this.baseUrl}/${API_PATH.PUPPETEER.CONVERT}`,
      formData,
      {
        observe: 'response', // ✅ เพื่อให้เราเข้าถึง header
        responseType: 'blob', // ✅ เพื่อให้ได้ binary PDF } // ✅ รับเป็น binary PDF
      }
    );
  }
}
