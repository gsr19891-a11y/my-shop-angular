import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPage } from './card-page';

describe('CardPage', () => {
  let component: CardPage;
  let fixture: ComponentFixture<CardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
