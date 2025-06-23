import { TestBed } from '@angular/core/testing';

import { ContentGenerationService } from './content-generation.service';

describe('ContentGenerationService', () => {
  let service: ContentGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
