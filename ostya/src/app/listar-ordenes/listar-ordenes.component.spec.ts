import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarOrdenesComponent } from './listar-ordenes.component';

describe('ListarOrdenesComponent', () => {
  let component: ListarOrdenesComponent;
  let fixture: ComponentFixture<ListarOrdenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarOrdenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
