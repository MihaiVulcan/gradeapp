import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';


import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { StudentsPageComponent } from './students-page/students-page.component';
import { StudentFormComponent } from './student-form/student-form.component';
import { TeachersPageComponent } from './teachers-page/teachers-page.component';
import { SubjectsPageComponent } from './subjects-page/subjects-page.component';
import { TeacherFormComponent } from './teacher-form/teacher-form.component';
import { SubjectFormComponent } from './subject-form/subject-form.component';
import { SubjectTeacherComponent } from './subject-teacher/subject-teacher.component';
import { SubjectStudentComponent } from './subject-student/subject-student.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { TeacherPageComponent } from './teacher-page/teacher-page.component';
import { TeacherPageSubjectsComponent } from './teacher-page-subjects/teacher-page-subjects.component';
import { StudentPageComponent } from './student-page/student-page.component';
import { TeacherSubjectsUpdateComponent } from './teacher-subjects-update/teacher-subjects-update.component';
import { TeacherUpdateGradeComponent } from './teacher-update-grade/teacher-update-grade.component';
import { StudentGradesComponent } from './student-grades/student-grades.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    StudentsPageComponent,
    TeachersPageComponent,
    SubjectsPageComponent,
    StudentFormComponent,
    TeacherFormComponent,
    SubjectFormComponent,
    SubjectTeacherComponent,
    SubjectStudentComponent,
    AdminPageComponent,
    LoginPageComponent,
    TeacherPageComponent,
    TeacherPageSubjectsComponent,
    StudentPageComponent,
    TeacherSubjectsUpdateComponent,
    TeacherUpdateGradeComponent,
    StudentGradesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
