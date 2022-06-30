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
import { AuthGuardGuard } from './auth/auth-guard.guard';
import { StudentHomeComponent } from './student-home/student-home.component';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';

const routes: Routes = [
  {path: '', redirectTo : '/login', pathMatch: 'full'},
  {path: 'login', component:LoginPageComponent},
  { 
    path : 'admin-page', 
    component: AdminPageComponent,
    canActivate: [AuthGuardGuard],
    data:{
      group:'admin'
    },
    children: [
      {path : 'students-page', component: StudentsPageComponent},
      {path : 'teachers-page', component: TeachersPageComponent},
      {path : 'subjects-page', component: SubjectsPageComponent},
      {path : 'home', component:AdminHomeComponent  }
    ]
  },
  {
    path: 'teacher-page', 
    component: TeacherPageComponent,
    canActivate: [AuthGuardGuard],
    data:{
      group:'teacher'
    }, 
    children: [
      {path: 'subjects', component: TeacherPageSubjectsComponent},
      {path: 'home', component: TeacherHomeComponent}
  ]},
  {
    path: 'student-page', 
    component: StudentPageComponent, 
    canActivate: [AuthGuardGuard],
    data:{
      group:'student'
    },
    children: [
      {path: 'grades', component: StudentGradesComponent},
      {path: 'home', component: StudentHomeComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
