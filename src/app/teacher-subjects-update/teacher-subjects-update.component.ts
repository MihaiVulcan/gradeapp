import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SubjectGrade, Subject } from '../teacher-page-subjects/teacher-page-subjects.component';
import { AuthService } from '../auth/auth.service';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

@Component({
  selector: 'app-teacher-subjects-update',
  templateUrl: './teacher-subjects-update.component.html',
  styleUrls: ['./teacher-subjects-update.component.css']
})
export class TeacherSubjectsUpdateComponent implements OnInit {

  subject : Subject = new Subject("", "", [], 0)
  grades : SubjectGrade[] = []
  sequence : number = 0

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private httpClient: HttpClient,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    console.log("dialog Init")
    this.subject = this.data["subject"]
    this.grades = this.subject.grades
    this.sequence = this.subject.sequence
    console.log(this.subject)
    console.log(this.grades)
    console.log(this.sequence)
  }

  update(){

    console.log(this.grades)

    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)

      this.httpClient.post<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/teacher-subjects/', {
        "subjectId":this.subject.subjectId,
        "grades":this.grades,
      },
      {
        headers: new HttpHeaders({
          'Authorization': session.getIdToken().getJwtToken(),
        }
      )
    }).subscribe(
        response => {
          
        })
      })
    }
  }

  newGrade(){
    this.grades.push(new SubjectGrade(this.sequence,"", 0))
    this.sequence++
  }

  delete(id:number){
    console.log(id)
    const index = this.grades.findIndex(x=> x.id == id)
    console.log(index)
    this.grades.splice(index, 1)
  }

}
