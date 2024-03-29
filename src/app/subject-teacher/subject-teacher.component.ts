import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TeacherFormComponent } from '../teacher-form/teacher-form.component';
import { Teacher } from '../teachers-page/teachers-page.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { CognitoUserSession } from 'amazon-cognito-identity-js';


export class SubjectTeacher {
  constructor(
    public id: string,
    public teacherId: string,
  ){
  }
}

@Component({
  selector: 'app-subject-teacher',
  templateUrl: './subject-teacher.component.html',
  styleUrls: ['./subject-teacher.component.css']
})

export class SubjectTeacherComponent implements OnInit, AfterViewInit {

  teachers: SubjectTeacher[] = [];
  allTeachers: SubjectTeacher[] = [];
  auxTeachers: SubjectTeacher[] = [];
  dataSourceExsist = new MatTableDataSource<SubjectTeacher>(this.teachers);
  dataSource = new MatTableDataSource<SubjectTeacher>(this.teachers);
  displayedColumns: String[] = ['id', 'actions']
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private auth: AuthService
  ) { }

  @ViewChild(MatPaginator)paginator!: MatPaginator;

  ngOnInit(): void {
      this.getTeachers()
  }

  ngAfterViewInit(){
    this.dataSource.paginator=this.paginator
  }

  getTeachers(){
    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)
        this.httpClient.get<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/subject/'+this.data['id']+'/teacher/',
        {
          headers: new HttpHeaders({
            'Authorization': session.getIdToken().getJwtToken(),
            'AccessToken': session.getAccessToken().getJwtToken()
          })
        }
        ).subscribe(
          response => {
            console.log(response)
            this.teachers = response.body
            this.dataSourceExsist.data = this.teachers
            console.log(this.dataSource)
            console.log(this.teachers)
            this.httpClient.get<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/teacher/?id=all', 
            {
              headers: new HttpHeaders({
                'Authorization': session.getIdToken().getJwtToken(),
                'AccessToken': session.getAccessToken().getJwtToken()
              })
            }
            ).subscribe(
              response => {
                console.log(response)
                this.auxTeachers = response.body;
                console.log(this.auxTeachers)
                this.allTeachers = this.auxTeachers.filter((objFromAux) => {
                  return !this.teachers.find(function(objFromExist) {
                    return objFromAux.id === objFromExist.teacherId
                  })
                })
                
                this.dataSource.data = this.allTeachers
              }
            )
          }
        )
      }
    )
  }
}

  deleteTeacher(id: string){
    console.log(id);
    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)
        this.httpClient.delete<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/subject/'+this.data['id']+'/teacher/?id='+id,
        {
          headers: new HttpHeaders({
            'Authorization': session.getIdToken().getJwtToken(),
            'AccessToken': session.getAccessToken().getJwtToken()
          })
        }
        ).subscribe(
          response => {
            console.log(response)
            this.getTeachers()
          })
        }
      )
    }  
  }

  addTeacher(id: string){
    var info : SubjectTeacher = new SubjectTeacher(this.data['id'], id)
    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)
        this.httpClient.post<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/subject/'+this.data['id']+'/teacher',
        info,
        {
          headers: new HttpHeaders({
            'Authorization': session.getIdToken().getJwtToken(),
            'AccessToken': session.getAccessToken().getJwtToken()
          })
        }
        ).subscribe(
          response => {
            console.log(response)
            this.getTeachers()
          })
        }
      )
    } 
  }
}
