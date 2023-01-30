import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSpeechRecordModalComponent } from './student-speech-record-modal.component';

describe('StudentSpeechRecordModalComponent', () => {
  let component: StudentSpeechRecordModalComponent;
  let fixture: ComponentFixture<StudentSpeechRecordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentSpeechRecordModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSpeechRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
