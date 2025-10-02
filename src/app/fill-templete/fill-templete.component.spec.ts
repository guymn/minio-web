import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillTempleteComponent } from './fill-templete.component';

describe('FillTempleteComponent', () => {
  let component: FillTempleteComponent;
  let fixture: ComponentFixture<FillTempleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FillTempleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FillTempleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
