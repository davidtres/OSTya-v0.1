import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenManualComponent } from './orden-manual.component';

describe('OrdenManualComponent', () => {
  let component: OrdenManualComponent;
  let fixture: ComponentFixture<OrdenManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
