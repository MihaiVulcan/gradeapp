import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject, NgZone, ViewChild } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StudentGrades } from '../teacher-page-subjects/teacher-page-subjects.component';
import { Component, OnInit } from '@angular/core';
import { findIndex, take } from 'rxjs';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AuthService } from '../auth/auth.service';
import { CognitoUserSession } from 'amazon-cognito-identity-js';


export class Grades{
  constructor(
    public id: number,
    public name: string,
    public grade: number,
    public feedback: string,
    public showFeedback: boolean
  ){}

}

@Component({
  selector: 'app-teacher-update-grade',
  templateUrl: './teacher-update-grade.component.html',
  styleUrls: ['./teacher-update-grade.component.css']
})
export class TeacherUpdateGradeComponent implements OnInit {

  constructor(
    private _ngZone: NgZone,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private httpClient: HttpClient,
    private auth: AuthService
  ) { }

  displayGrades: Grades[] = []

  studentGrades: StudentGrades = new StudentGrades("","","",0,"",[])


  ngOnInit(): void {
    console.log("Dialog Initialize")
    console.log(this.data)

    this.studentGrades=this.data["student"]

    for (var grade of this.data["subject"]["grades"]){
      console.log(grade)
      var index = this.studentGrades["grades"].findIndex(x => x["id"]==grade["id"])
      if(index!=-1)
        this.displayGrades.push(new Grades(grade["id"], grade["name"], this.studentGrades.grades[index].grade, this.studentGrades.grades[index].feedback, false))
      else
        this.displayGrades.push(new Grades(grade["id"], grade["name"], 0, "", false))
    }
  }

  save(){

    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)


      console.log(this.displayGrades)
      this.httpClient.post<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/teacher-grades/',
        {
          "subjectId":this.data["subject"]["subjectId"],
          "studentId":this.studentGrades.studentId,
          "grades":this.displayGrades
        },
        {
          headers: new HttpHeaders({
            'Authorization': session.getIdToken().getJwtToken(),
            'AccessToken': session.getAccessToken().getJwtToken()
          }
        )
      }).subscribe(
        response => {
          
        })
      })
    }
  }

}
