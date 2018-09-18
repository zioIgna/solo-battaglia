import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiocoComponent } from './gioco.component';

describe('GiocoComponent', () => {
  let component: GiocoComponent;
  let fixture: ComponentFixture<GiocoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiocoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiocoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
