import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonTrackRegisterComponent } from './lesson-track-register.component';

describe('LessonTrackRegisterComponent', () => {
  let component: LessonTrackRegisterComponent;
  let fixture: ComponentFixture<LessonTrackRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LessonTrackRegisterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonTrackRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
