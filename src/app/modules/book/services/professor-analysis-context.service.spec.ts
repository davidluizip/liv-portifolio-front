import { TestBed } from '@angular/core/testing';

import { ProfessorAnalysisContextService } from './professor-analysis-context.service';

describe('ProfessorAnalysisContextService', () => {
  let service: ProfessorAnalysisContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfessorAnalysisContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
