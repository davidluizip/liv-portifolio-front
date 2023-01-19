import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorAnalysisModalComponent } from './professor-analysis-modal.component';

describe('ProfessorAnalysisModalComponent', () => {
  let component: ProfessorAnalysisModalComponent;
  let fixture: ComponentFixture<ProfessorAnalysisModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessorAnalysisModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessorAnalysisModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
