import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppProductCard } from './app-product-card';

describe('AppProductCard', () => {
  let component: AppProductCard;
  let fixture: ComponentFixture<AppProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(AppProductCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
