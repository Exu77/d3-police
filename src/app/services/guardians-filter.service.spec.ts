import { TestBed } from '@angular/core/testing';

import { GuardiansFilterService } from './guardians-filter.service';

describe('GuardiansFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuardiansFilterService = TestBed.get(GuardiansFilterService);
    expect(service).toBeTruthy();
  });
});
