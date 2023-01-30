import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverBackComponent } from './cover-back.component';

describe('CoverBackComponent', () => {
  let component: CoverBackComponent;
  let fixture: ComponentFixture<CoverBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverBackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
