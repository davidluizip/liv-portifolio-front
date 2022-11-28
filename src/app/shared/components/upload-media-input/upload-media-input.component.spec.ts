import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMediaInputComponent } from './upload-media-input.component';

describe('UploadMediaInputComponent', () => {
  let component: UploadMediaInputComponent;
  let fixture: ComponentFixture<UploadMediaInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadMediaInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadMediaInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
