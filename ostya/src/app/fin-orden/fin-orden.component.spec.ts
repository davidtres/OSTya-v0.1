import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinOrdenComponent } from './fin-orden.component';

describe('FinOrdenComponent', () => {
  let component: FinOrdenComponent;
  let fixture: ComponentFixture<FinOrdenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinOrdenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
