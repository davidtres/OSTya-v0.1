import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TservicioComponent } from './tservicio.component';

describe('TservicioComponent', () => {
  let component: TservicioComponent;
  let fixture: ComponentFixture<TservicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TservicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TservicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
