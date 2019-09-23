import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityDetalleComponent } from './quality-detalle.component';

describe('QualityDetalleComponent', () => {
  let component: QualityDetalleComponent;
  let fixture: ComponentFixture<QualityDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
