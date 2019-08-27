import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaxtecnicoComponent } from './agendaxtecnico.component';

describe('AgendaxtecnicoComponent', () => {
  let component: AgendaxtecnicoComponent;
  let fixture: ComponentFixture<AgendaxtecnicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaxtecnicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaxtecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
