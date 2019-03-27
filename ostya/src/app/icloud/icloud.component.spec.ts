import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcloudComponent } from './icloud.component';

describe('IcloudComponent', () => {
  let component: IcloudComponent;
  let fixture: ComponentFixture<IcloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
