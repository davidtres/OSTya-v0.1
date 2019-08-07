import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaPrComponent } from './agenda-pr.component';

describe('AgendaPrComponent', () => {
  let component: AgendaPrComponent;
  let fixture: ComponentFixture<AgendaPrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaPrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaPrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
