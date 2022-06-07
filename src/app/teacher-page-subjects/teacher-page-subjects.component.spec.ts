import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPageSubjectsComponent } from './teacher-page-subjects.component';

describe('TeacherPageSubjectsComponent', () => {
  let component: TeacherPageSubjectsComponent;
  let fixture: ComponentFixture<TeacherPageSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherPageSubjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherPageSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
