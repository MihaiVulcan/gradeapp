import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AuthService } from '../auth/auth.service';
import { Student } from '../students-page/students-page.component';

@Component({
  selector: 'app-student-update',
  templateUrl: './student-update.component.html',
  styleUrls: ['./student-update.component.css']
})
export class StudentUpdateComponent implements OnInit {

  studentsForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private auth: AuthService
    ) { }

  ngOnInit(): void {
    this.studentsForm = this.fb.group({
      id:this.data.student['id'],
      lastName:this.data.student['lastName'],
      firstName:this.data.student['firstName'],
      codeAcademic: this.data.student['codeAcademic'],
      email: this.data.student['email'],
      group: this.data.student['group'],
      year: this.data.student['year'],
    });
  }

  onSubmit(): void{
    console.log(this.studentsForm)
    var student: Student = new Student(
      this.studentsForm.controls['id'].value, 
      this.studentsForm.controls['firstName'].value, 
      this.studentsForm.controls['lastName'].value,
      this.studentsForm.controls['group'].value,
      this.studentsForm.controls['year'].value,
      this.studentsForm.controls['codeAcademic'].value,
      this.studentsForm.controls['email'].value
      )

    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
            return;
        console.log(session)  
        this.httpClient.put('https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/student/',
        student,
        {
          headers: new HttpHeaders({
            'Authorization': session.getIdToken().getJwtToken(),
            'AccessToken': session.getAccessToken().getJwtToken()
          })
        }
        ).subscribe((data: any) => {
            console.log(data)
        })
      })
    }
  }

}
