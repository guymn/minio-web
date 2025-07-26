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

    this.minioService.getPresignedUrl(this.fileName).subscribe((res: any) => {
      console.log(res.data);
      // ใช้ window.open เพื่อดาวน์โหลด
      window.open(res.data, '_blank');
      this.presignedUrl = res.data;
    });
  }
}
