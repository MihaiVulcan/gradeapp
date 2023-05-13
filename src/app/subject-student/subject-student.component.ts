import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StudentFormComponent } from '../student-form/student-form.component';
import { Student } from '../students-page/students-page.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { CognitoUserSession } from 'amazon-cognito-identity-js';


export class SubjectStudent {
  constructor(
    public id: string,
    public studentId: string,
  ){
  }
}

@Component({
  selector: 'app-subject-student',
  templateUrl: './subject-student.component.html',
  styleUrls: ['./subject-student.component.css']
})


export class SubjectStudentComponent implements OnInit, AfterViewInit{

  students: SubjectStudent[] = [];
  allStudents: SubjectStudent[] = [];
  auxStudents: SubjectStudent[] = [];
  dataSourceExsist = new MatTableDataSource<SubjectStudent>(this.students);
  dataSource = new MatTableDataSource<SubjectStudent>(this.students);
  displayedColumns: String[] = ['id', 'actions']
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private auth: AuthService,
  ) { }

  @ViewChild(MatPaginator)paginator!: MatPaginator;

  ngOnInit(): void {
      this.getStudents()
  }

  ngAfterViewInit(){
    this.dataSource.paginator=this.paginator
  }

  getStudents(){
    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)
        this.httpClient.get<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/subject/'+this.data['id']+'/student/',{
          headers: new HttpHeaders({
            'Authorization': session.getIdToken().getJwtToken(),
            'AccessToken': session.getAccessToken().getJwtToken()
          })
          }
          ).subscribe(
          response => {
            console.log(response)
            this.students = response.body
            this.dataSourceExsist.data = this.students
            console.log(this.dataSource)
            console.log(this.students)
            this.httpClient.get<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/student/?id=all',{
              headers: new HttpHeaders({
                'Authorization': session.getIdToken().getJwtToken(),
                'AccessToken': session.getAccessToken().getJwtToken()
              })
            }).subscribe(
              response => {
                console.log(response)
                this.auxStudents = response.body;
                console.log(this.auxStudents)
                this.allStudents = this.auxStudents.filter((objFromAux) => {
                  return !this.students.find(function(objFromExist) {
                    return objFromAux.id === objFromExist.studentId
                  })
                })
                
                this.dataSource.data = this.allStudents
              }
            )
          }
        )
      }
    )
  }
}

  deleteStudent(id: string){
    console.log(id);
    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)
        this.httpClient.delete<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/subject/'+this.data['id']+'/student/?id='+id,
        {
          headers: new HttpHeaders({
            'Authorization': session.getIdToken().getJwtToken(),
            'AccessToken': session.getAccessToken().getJwtToken()
          })
        }
        ).subscribe(
          response => {
            console.log(response)
            this.getStudents()
          })
        }
      )
    }
  }

  addStudent(id: string){
    var info : SubjectStudent = new SubjectStudent(this.data['id'], id)
    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)
        this.httpClient.post<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/subject/'+this.data['id']+'/student',
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
            this.getStudents()
          })
        }
      )
    }
  }

}
