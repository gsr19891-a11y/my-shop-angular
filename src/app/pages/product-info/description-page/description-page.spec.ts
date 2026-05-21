import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionPage } from './description-page';

describe('DescriptionPage', () => {
  let component: DescriptionPage;
  let fixture: ComponentFixture<DescriptionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
