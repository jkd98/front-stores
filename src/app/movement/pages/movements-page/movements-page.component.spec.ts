import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementsPageComponent } from './movements-page.component';

describe('MovementsPageComponent', () => {
  let component: MovementsPageComponent;
  let fixture: ComponentFixture<MovementsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovementsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
