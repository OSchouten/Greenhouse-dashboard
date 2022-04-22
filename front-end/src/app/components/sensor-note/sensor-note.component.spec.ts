import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorNoteComponent } from './sensor-note.component';

describe('SensorNoteComponent', () => {
  let component: SensorNoteComponent;
  let fixture: ComponentFixture<SensorNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
