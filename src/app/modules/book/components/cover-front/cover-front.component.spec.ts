import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverFrontComponent } from './cover-front.component';

describe('CoverFrontComponent', () => {
  let component: CoverFrontComponent;
  let fixture: ComponentFixture<CoverFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverFrontComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
