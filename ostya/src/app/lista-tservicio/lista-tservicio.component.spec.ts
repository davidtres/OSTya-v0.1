import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTservicioComponent } from './lista-tservicio.component';

describe('ListaTservicioComponent', () => {
  let component: ListaTservicioComponent;
  let fixture: ComponentFixture<ListaTservicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaTservicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTservicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
