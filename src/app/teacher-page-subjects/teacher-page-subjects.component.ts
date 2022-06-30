import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { TeacherService } from '../teacher.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { TeacherSubjectsUpdateComponent } from '../teacher-subjects-update/teacher-subjects-update.component';
import { TeacherUpdateGradeComponent } from '../teacher-update-grade/teacher-update-grade.component';
import { AuthService } from '../auth/auth.service';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { MatTableDataSource } from '@angular/material/table';


export class SubjectGrade{
  constructor(
    public id: number,
    public name: string,
    public procent: number
  ){}
}

export class StudentGrade{
  constructor(
    public id: number,
    public grade: number,
    public feedback: string
  ){}
}

export class Subject{
  constructor(
    public subjectId: string,
    public name: string,
    public grades: SubjectGrade[],
    public sequence: number
  ){}
}

export class StudentGrades{
  constructor(
      public studentId: string,
      public firstName: string,
      public lastName: string,
      public group: number,
      public codAcademic: string,
      public grades: StudentGrade[],
  ){}
}

@Component({
  selector: 'app-teacher-page-subjects',
  templateUrl: './teacher-page-subjects.component.html',
  styleUrls: ['./teacher-page-subjects.component.css']
})
export class TeacherPageSubjectsComponent implements OnInit {

  constructor(
    private teacherService: TeacherService, 
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private auth: AuthService
    ) { }

  subjects: Subject[] = []

  selectedSubject : Subject = new Subject("", "", [], 0)

  studentGrades : StudentGrades[] = []

  show: Boolean = false

  displayedColumns: string[] = ["actions", "id", "firstName", "lastName", "group"]

  datasource = new MatTableDataSource(this.studentGrades); 

  filter = "";

  ngOnInit(): void {
    this.loadSubjects()
  }

  applyFilter(filterValue: string) {
    if(filterValue!=""){
      filterValue = filterValue.trim(); // Remove whitespace
      this.datasource.filter = filterValue;
    }
  }

  loadSubjects(){
    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)
        this.httpClient.get<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/teacher-subjects/?id='+this.auth.getUsername(),{
          headers: new HttpHeaders({
            'Authorization': session.getIdToken().getJwtToken(),
            'AccessToken': session.getAccessToken().getJwtToken()
          })
        }).subscribe(
          response => {
            console.log(response)
            this.subjects = response["body"]
            console.log(this.subjects)
          })
      })
    }
  }

  update(subject:Subject){

    const dialogRef = this.dialog.open(TeacherSubjectsUpdateComponent, {
      data : {
        "subject":subject
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadSubjects()
    });
  }

  openGrades(subject: Subject){
    console.log(subject.subjectId)
    this.selectedSubject = subject

    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)
        this.httpClient.get<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/teacher-grades/?id='+this.selectedSubject.subjectId,{
          headers: new HttpHeaders({
            'Authorization': session.getIdToken().getJwtToken(),
            'AccessToken': session.getAccessToken().getJwtToken()
          })
        }).subscribe(
          response => {
            console.log(response)
            this.show=true
            this.studentGrades = response["body"]
            this.datasource.data = this.studentGrades;
            console.log(this.studentGrades)
          })
      })
    }
  }

  editGrade(student: StudentGrades){
    const dialogRef = this.dialog.open(TeacherUpdateGradeComponent, {
      data : {
        "student":student,
        "subject":this.selectedSubject
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.openGrades(this.selectedSubject)
    });
  }

}


