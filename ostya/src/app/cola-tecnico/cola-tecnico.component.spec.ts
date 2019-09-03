import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColaTecnicoComponent } from './cola-tecnico.component';

describe('ColaTecnicoComponent', () => {
  let component: ColaTecnicoComponent;
  let fixture: ComponentFixture<ColaTecnicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColaTecnicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColaTecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
