import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsPageComponent } from './students-page/students-page.component';
import { TeachersPageComponent } from './teachers-page/teachers-page.component';
import { SubjectsPageComponent } from './subjects-page/subjects-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { TeacherPageComponent } from './teacher-page/teacher-page.component';
import { TeacherPageSubjectsComponent } from './teacher-page-subjects/teacher-page-subjects.component';
import { StudentPageComponent } from './student-page/student-page.component';
import { StudentGradesComponent } from './student-grades/student-grades.component';

const routes: Routes = [
  {path: '', redirectTo : '/login', pathMatch: 'full'},
  {path: 'login', component:LoginPageComponent},
  {path : 'admin-page', component: AdminPageComponent, children: [
    {path : 'students-page', component: StudentsPageComponent},
    {path : 'teachers-page', component: TeachersPageComponent},
    {path : 'subjects-page', component: SubjectsPageComponent}
    ]
  },
  {path: 'teacher-page', component: TeacherPageComponent, children: [
    {path: 'subjects', component: TeacherPageSubjectsComponent}
  ]},
  {path: 'student-page', component: StudentPageComponent, children: [
    {path: 'grades', component: StudentGradesComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
