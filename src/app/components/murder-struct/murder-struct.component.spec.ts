import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MurderStructComponent } from './murder-struct.component';

describe('MurderStructComponent', () => {
  let component: MurderStructComponent;
  let fixture: ComponentFixture<MurderStructComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MurderStructComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MurderStructComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
