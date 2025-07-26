import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresignedUrlComponent } from './presigned-url.component';

describe('PresignedUrlComponent', () => {
  let component: PresignedUrlComponent;
  let fixture: ComponentFixture<PresignedUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresignedUrlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresignedUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
