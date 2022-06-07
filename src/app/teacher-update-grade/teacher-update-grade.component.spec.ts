import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherUpdateGradeComponent } from './teacher-update-grade.component';

describe('TeacherUpdateGradeComponent', () => {
  let component: TeacherUpdateGradeComponent;
  let fixture: ComponentFixture<TeacherUpdateGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherUpdateGradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherUpdateGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
