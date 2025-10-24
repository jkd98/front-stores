import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form2FAComponent } from './form-2-fa.component';

describe('Form2FAComponent', () => {
  let component: Form2FAComponent;
  let fixture: ComponentFixture<Form2FAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form2FAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Form2FAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
