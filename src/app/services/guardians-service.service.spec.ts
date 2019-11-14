import { TestBed } from '@angular/core/testing';

import { GuardiansServiceService } from './guardians-service.service';

describe('GuardiansServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuardiansServiceService = TestBed.get(GuardiansServiceService);
    expect(service).toBeTruthy();
  });
});
