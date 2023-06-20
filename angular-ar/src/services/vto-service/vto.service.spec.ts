import { TestBed } from '@angular/core/testing';

import { VtoService } from './vto.service';

describe('VtoService', () => {
  let service: VtoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VtoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
