import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCheckoutsComponent } from './my-checkouts.component';

describe('MyCheckoutsComponent', () => {
  let component: MyCheckoutsComponent;
  let fixture: ComponentFixture<MyCheckoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCheckoutsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCheckoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
