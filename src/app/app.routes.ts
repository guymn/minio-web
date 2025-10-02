import { RouterModule, Routes } from '@angular/router';
import { UploadTestComponent } from './pages/upload-test/upload-test.component';
import { NgModule } from '@angular/core';
import { DownloadTestComponent } from './download-test/download-test.component';
import { UploadListTestComponent } from './upload-list-test/upload-list-test.component';
import { FillTempleteComponent } from './fill-templete/fill-templete.component';

export const routes: Routes = [
  { path: 'upload-test', component: UploadTestComponent },
  { path: 'download-test', component: DownloadTestComponent },
  { path: 'upload-list-test', component: UploadListTestComponent },
  { path: 'fill-templete-test', component: FillTempleteComponent },
  { path: '', redirectTo: '/upload-list-test', pathMatch: 'full' }, // หน้า default
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
