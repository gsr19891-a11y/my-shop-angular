import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsPage } from './reviews-page';

describe('ReviewsPage', () => {
  let component: ReviewsPage;
  let fixture: ComponentFixture<ReviewsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
