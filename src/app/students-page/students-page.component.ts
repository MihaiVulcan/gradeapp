import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AuthService } from '../auth/auth.service';
import { StudentFormComponent } from '../student-form/student-form.component';

export class Student {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public group: string,
    public year: number,
    public codeAcademic: string,
    public email: string
  ){
  }
}

@Component({
  selector: 'app-students-page',
  templateUrl: './students-page.component.html',
  styleUrls: ['./students-page.component.css']
})


export class StudentsPageComponent implements OnInit {

  students: Student[] = [];
  dataSource = new MatTableDataSource<Student>(this.students);
  displayedColumns: String[] = ['id', 'lastName', 'firstName', 'email', 'codeAcademic', 'group', 'year', 'actions']
  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private auth: AuthService
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

        this.httpClient.get<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/student/?id=all',
        {
          headers: new HttpHeaders({
            'Authorization': session.getIdToken().getJwtToken(),
          })
        }
        
        ).subscribe(
          response => {
            console.log(response)
            this.students = response.body
            this.dataSource.data = this.students
            console.log(this.dataSource)
            console.log(this.students)
          }
        )
      })
    }
  }

  deleteStudent(id: string){
    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)

        console.log(id);
        this.httpClient.delete<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/student/?id='+id,
        {
          headers: new HttpHeaders({
            'Authorization': session.getIdToken().getJwtToken(),
          })
        }
        ).subscribe(
          response => {
            console.log(response)
          })
        this.getStudents()
      })
    }
  }

  onNewStudent(){
    const dialogRef = this.dialog.open(StudentFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getStudents();
    });
  }

  editStudent(id: string){

  }

}
