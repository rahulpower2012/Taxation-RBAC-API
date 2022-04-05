import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxacDashboardComponent } from './taxac-dashboard.component';

describe('TaxacDashboardComponent', () => {
  let component: TaxacDashboardComponent;
  let fixture: ComponentFixture<TaxacDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxacDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxacDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
