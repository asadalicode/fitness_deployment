import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrangeCoachesComponent } from './arrange-coaches.component';

describe('ArrangeCoachesComponent', () => {
  let component: ArrangeCoachesComponent;
  let fixture: ComponentFixture<ArrangeCoachesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArrangeCoachesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrangeCoachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
