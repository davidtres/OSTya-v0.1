import { TestBed } from '@angular/core/testing';

import { ComunicationService } from './comunication.service';

describe('ComunicationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComunicationService = TestBed.get(ComunicationService);
    expect(service).toBeTruthy();
  });
});
