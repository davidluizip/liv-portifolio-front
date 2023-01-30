import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSelectModalComponent } from './register-select-modal.component';

describe('RegisterSelectModalComponent', () => {
  let component: RegisterSelectModalComponent;
  let fixture: ComponentFixture<RegisterSelectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterSelectModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
