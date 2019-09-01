import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCoordenadasComponent } from './set-coordenadas.component';

describe('SetCoordenadasComponent', () => {
  let component: SetCoordenadasComponent;
  let fixture: ComponentFixture<SetCoordenadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetCoordenadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCoordenadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
