import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorAnalisysComponent } from './professor-analisys.component';

describe('ProfessorAnalisysComponent', () => {
  let component: ProfessorAnalisysComponent;
  let fixture: ComponentFixture<ProfessorAnalisysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessorAnalisysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessorAnalisysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
