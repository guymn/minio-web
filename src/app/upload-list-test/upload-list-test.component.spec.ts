import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadListTestComponent } from './upload-list-test.component';

describe('UploadListTestComponent', () => {
  let component: UploadListTestComponent;
  let fixture: ComponentFixture<UploadListTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadListTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadListTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
