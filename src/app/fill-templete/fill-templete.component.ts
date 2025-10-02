import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ✅ import FormsModule
import { CkService } from '../services/ck.service';

@Component({
  selector: 'app-fill-templete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fill-templete.component.html',
  styleUrls: ['./fill-templete.component.css'],
})
export class FillTempleteComponent {
  selectedFile?: File;
  htmlText: string = '';
  extractedData: Record<string, string> = {};

  constructor(private ckService: CkService) {}

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.htmlText = reader.result as string;

        // แปลง HTML string เป็น DOM
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.htmlText, 'text/html');

        // หา input ที่มี id
        const inputs = doc.querySelectorAll('input[id]');
        const data: Record<string, string> = {};

        inputs.forEach((input) => {
          const id = input.getAttribute('id')!;
          const value = input.getAttribute('value') || '';
          data[id] = value.replace(/<Field.*?>/g, '').replace(/&lt;|&gt;/g, '');
          // ^ ตัด placeholder "<Field ...>" ทิ้ง
        });

        this.extractedData = data;
        console.log('Extracted Data:', this.extractedData);
      };

      reader.readAsText(this.selectedFile);
    }
  }

  onFillTemplete(event: SubmitEvent) {
    event.preventDefault();
    console.log('ส่ง Map ไป Backend:', this.extractedData);
    if (!this.selectedFile) {
      return;
    }
    this.ckService
      .fillTemplate(this.selectedFile, this.extractedData)
      .subscribe({
        next: (blob) => {
          // สร้าง URL จาก blob
          const url = window.URL.createObjectURL(blob);

          // สร้างลิงก์ดาวน์โหลด
          const a = document.createElement('a');
          a.href = url;
          a.download = 'filled_template.html'; // ชื่อไฟล์ที่จะดาวน์โหลด
          a.click();

          // ลบ object URL ทิ้งหลังใช้งาน
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('เกิดข้อผิดพลาด:', err);
        },
      });
  }

  trackByKey(index: number, field: any) {
    return field.key; // ใช้ key เป็น unique id
  }
}
