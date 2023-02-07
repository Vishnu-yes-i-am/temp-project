import { TestBed } from '@angular/core/testing';

import { IgnoreHttpEventService } from './ignore-http-event.service';

describe('IgnoreHttpEventService', () => {
  let service: IgnoreHttpEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IgnoreHttpEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
