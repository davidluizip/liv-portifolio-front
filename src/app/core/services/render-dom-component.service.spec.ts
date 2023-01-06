import { TestBed } from '@angular/core/testing';

import { RenderDomComponentService } from './render-dom-component.service';

describe('RenderDomComponentService', () => {
  let service: RenderDomComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenderDomComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
