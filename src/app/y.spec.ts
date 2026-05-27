import { TestBed } from '@angular/core/testing';

import { Y } from './y';

describe('Y', () => {
  let service: Y;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Y);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
