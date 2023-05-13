import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AuthService } from '../auth/auth.service';
import { TeacherFormComponent } from '../teacher-form/teacher-form.component';
import { TeacherUpdateComponent } from '../teacher-update/teacher-update.component';

export class Teacher {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string
  ){
  }
}

@Component({
  selector: 'app-teachers-page',
  templateUrl: './teachers-page.component.html',
  styleUrls: ['./teachers-page.component.css']
})


export class TeachersPageComponent implements OnInit, AfterViewInit{


  teachers: Teacher[] = [];
  dataSource = new MatTableDataSource<Teacher>(this.teachers);
  displayedColumns: String[] = ['id', 'lastName', 'firstName', 'email', 'actions']
  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private auth: AuthService
  ) { }

  @ViewChild(MatPaginator)paginator!: MatPaginator;

  filter= ''

  ngOnInit(): void {
      this.getTeachers()
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

  getTeachers(){
    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)

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
          this.teachers = response.body
          this.dataSource.data = this.teachers
          console.log(this.dataSource)
          console.log(this.teachers)
        }
      )
      })
    }
  }

  deleteTeacher(id: string){

    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;

      console.log(session)
      console.log(id);
      this.httpClient.delete<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/teacher/?id='+id,
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
      this.getTeachers()
      })
    }
  }

  onNewTeacher(){
    const dialogRef = this.dialog.open(TeacherFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getTeachers();
    });
  }

  editTeacher(teacher: Teacher){
    const dialogRef = this.dialog.open(TeacherUpdateComponent,{
      "data":{
        "teacher":teacher
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getTeachers();
    });
  }

}

