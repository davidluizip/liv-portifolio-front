import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverFrontBacksideComponent } from './cover-front-backside.component';

describe('CoverFrontBacksideComponent', () => {
  let component: CoverFrontBacksideComponent;
  let fixture: ComponentFixture<CoverFrontBacksideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverFrontBacksideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverFrontBacksideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
