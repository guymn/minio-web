import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadTestComponent } from './download-test.component';

describe('DownloadTestComponent', () => {
  let component: DownloadTestComponent;
  let fixture: ComponentFixture<DownloadTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
