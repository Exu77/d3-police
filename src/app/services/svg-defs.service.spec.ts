import { TestBed } from '@angular/core/testing';

import { SvgDefsService } from './svg-defs.service';

describe('SvgDefsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SvgDefsService = TestBed.get(SvgDefsService);
    expect(service).toBeTruthy();
  });
});
