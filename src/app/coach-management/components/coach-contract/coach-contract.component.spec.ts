import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachContractComponent } from './coach-contract.component';

describe('CoachContractComponent', () => {
  let component: CoachContractComponent;
  let fixture: ComponentFixture<CoachContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoachContractComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
