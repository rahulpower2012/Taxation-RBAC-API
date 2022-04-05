import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxpDashboardComponent } from './taxp-dashboard.component';

describe('TaxpDashboardComponent', () => {
  let component: TaxpDashboardComponent;
  let fixture: ComponentFixture<TaxpDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxpDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxpDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
