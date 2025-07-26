import { RouterModule, Routes } from '@angular/router';
import { UploadTestComponent } from './pages/upload-test/upload-test.component';
import { NgModule } from '@angular/core';
import { PresignedUrlComponent } from './pages/presigned-url/presigned-url.component';

export const routes: Routes = [
  { path: 'upload-test', component: UploadTestComponent },
  { path: 'presigned-url', component: PresignedUrlComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
