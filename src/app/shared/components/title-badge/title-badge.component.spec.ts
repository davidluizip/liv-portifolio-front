import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleBadgeComponent } from './title-badge.component';

describe('TitleBadgeComponent', () => {
  let component: TitleBadgeComponent;
  let fixture: ComponentFixture<TitleBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitleBadgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
