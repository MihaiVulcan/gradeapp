import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AuthService } from '../auth/auth.service';
import { SubjectFormComponent } from '../subject-form/subject-form.component';
import { SubjectStudentComponent } from '../subject-student/subject-student.component';
import { SubjectTeacherComponent } from '../subject-teacher/subject-teacher.component';
import { SubjectUpdateComponent } from '../subject-update/subject-update.component';

export class Subject {
  constructor(
    public id: string,
    public name: string,
    public semester: number,
    public credits: number
  ){
  }
}

@Component({
  selector: 'app-subjects-page',
  templateUrl: './subjects-page.component.html',
  styleUrls: ['./subjects-page.component.css']
})
export class SubjectsPageComponent implements OnInit {

  subjects: Subject[] = [];
  dataSource = new MatTableDataSource<Subject>(this.subjects);
  displayedColumns: String[] = ['id', 'name', 'semester', 'credits', 'addteacher', 'addstudent','actions']
  filter = ''
  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private auth: AuthService
  ) { }

  @ViewChild(MatPaginator)paginator!: MatPaginator;

  ngOnInit(): void {
      this.getSubjects()
      
  }

  ngAfterViewInit(){
    this.dataSource.paginator=this.paginator
  }

  applyFilter(filterValue: string) {
    if(filterValue!=""){
      filterValue = filterValue.trim(); // Remove whitespace
      this.dataSource.filter = filterValue;
    }
  }

  getSubjects(){
    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)

      this.httpClient.get<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/subject/?id=all',
      {
        headers: new HttpHeaders({
          'Authorization': session.getIdToken().getJwtToken(),
          'AccessToken': session.getAccessToken().getJwtToken()
        })
      }
      ).subscribe(
        response => {
          console.log(response)
          this.subjects = response.body
          this.dataSource.data = this.subjects
          console.log(this.dataSource)
          console.log(this.subjects)
        }
      )
      })
    }
  }

  deleteSubject(id: string){
    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)

      console.log(id);
      this.httpClient.delete<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/subject/?id='+id,
      {
        headers: new HttpHeaders({
          'Authorization': session.getIdToken().getJwtToken(),
          'AccessToken': session.getAccessToken().getJwtToken()
        })
      }
      ).subscribe(
        response => {
          console.log(response)
        })
      this.getSubjects()
      })
    }
  }

  onNewSubject(){
    const dialogRef = this.dialog.open(SubjectFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getSubjects();
    });
  }

  editSubject(subject: Subject){
    const dialogRef = this.dialog.open(SubjectUpdateComponent,{
      "data":{
        "subject":subject
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getSubjects();
    });
  }

  addTeacher(id: string){
    const dialogRef = this.dialog.open(SubjectTeacherComponent, {
      data: {
        "id": id
      }
    });
  }


  addStudent(id: string){
    const dialogRef = this.dialog.open(SubjectStudentComponent, {
      data: {
        "id": id
      }
    });
  }

}
