import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSubjectsUpdateComponent } from './teacher-subjects-update.component';

describe('TeacherSubjectsUpdateComponent', () => {
  let component: TeacherSubjectsUpdateComponent;
  let fixture: ComponentFixture<TeacherSubjectsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherSubjectsUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherSubjectsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
