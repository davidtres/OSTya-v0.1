import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTequipoComponent } from './listar-tequipo.component';

describe('ListarTequipoComponent', () => {
  let component: ListarTequipoComponent;
  let fixture: ComponentFixture<ListarTequipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarTequipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarTequipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
