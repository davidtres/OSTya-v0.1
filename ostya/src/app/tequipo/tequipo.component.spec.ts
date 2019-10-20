import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TequipoComponent } from './tequipo.component';

describe('TequipoComponent', () => {
  let component: TequipoComponent;
  let fixture: ComponentFixture<TequipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TequipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TequipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
