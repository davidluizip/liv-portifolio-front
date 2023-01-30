import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonTrackComponent } from './lesson-track.component';

describe('LessonTrackComponent', () => {
  let component: LessonTrackComponent;
  let fixture: ComponentFixture<LessonTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonTrackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
