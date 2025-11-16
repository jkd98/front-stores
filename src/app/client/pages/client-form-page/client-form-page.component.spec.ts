import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFormPageComponent } from './client-form-page.component';

describe('ClientFormPageComponent', () => {
  let component: ClientFormPageComponent;
  let fixture: ComponentFixture<ClientFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientFormPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
