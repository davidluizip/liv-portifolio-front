import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBaseHeaderModalComponent } from './register-base-header-modal.component';

describe('RegisterBaseHeaderModalComponent', () => {
  let component: RegisterBaseHeaderModalComponent;
  let fixture: ComponentFixture<RegisterBaseHeaderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterBaseHeaderModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterBaseHeaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
