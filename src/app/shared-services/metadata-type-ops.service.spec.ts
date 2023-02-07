import { TestBed } from '@angular/core/testing';

import { MetadataTypeOpsService } from './metadata-type-ops.service';

describe('MetadataTypeOpsService', () => {
  let service: MetadataTypeOpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetadataTypeOpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
