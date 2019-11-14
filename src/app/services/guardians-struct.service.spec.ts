import { TestBed } from '@angular/core/testing';

import { GuardiansStructService } from './guardians-struct.service';

describe('GuardiansStructService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuardiansStructService = TestBed.get(GuardiansStructService);
    expect(service).toBeTruthy();
  });
});
