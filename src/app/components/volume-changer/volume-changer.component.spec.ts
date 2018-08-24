import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeChangerComponent } from './volume-changer.component';

describe('VolumeChangerComponent', () => {
  let component: VolumeChangerComponent;
  let fixture: ComponentFixture<VolumeChangerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VolumeChangerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeChangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
