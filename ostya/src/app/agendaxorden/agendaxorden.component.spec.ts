import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaxordenComponent } from './agendaxorden.component';

describe('AgendaxordenComponent', () => {
  let component: AgendaxordenComponent;
  let fixture: ComponentFixture<AgendaxordenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaxordenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaxordenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
