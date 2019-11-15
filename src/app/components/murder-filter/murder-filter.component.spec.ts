import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MurderFilterComponent } from './murder-filter.component';

describe('MurderFilterComponent', () => {
  let component: MurderFilterComponent;
  let fixture: ComponentFixture<MurderFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MurderFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MurderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
