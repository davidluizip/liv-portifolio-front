import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAnalysisComponent } from './register-analysis.component';

describe('RegisterAnalysisComponent', () => {
  let component: RegisterAnalysisComponent;
  let fixture: ComponentFixture<RegisterAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
