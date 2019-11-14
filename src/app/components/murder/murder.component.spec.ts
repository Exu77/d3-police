import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MurderComponent } from './murder.component';

describe('MurderComponent', () => {
  let component: MurderComponent;
  let fixture: ComponentFixture<MurderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MurderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MurderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
