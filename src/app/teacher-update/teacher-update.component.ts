import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AuthService } from '../auth/auth.service';
import { Teacher } from '../teachers-page/teachers-page.component';

@Component({
  selector: 'app-teacher-update',
  templateUrl: './teacher-update.component.html',
  styleUrls: ['./teacher-update.component.css']
})
export class TeacherUpdateComponent implements OnInit {

  teachersForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private auth: AuthService
    ) { }

  ngOnInit(): void {
    this.teachersForm = this.fb.group({
      id:this.data.teacher['id'],
      lastName:this.data.teacher['lastName'],
      firstName:this.data.teacher['firstName'],
      email:this.data.teacher['email']
    });
  }

  onSubmit(): void{

    if(!this.teachersForm.valid){
      return;
    }

    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)

      console.log(this.teachersForm)
      var teacher: Teacher = new Teacher(this.teachersForm.controls['id'].value, this.teachersForm.controls['firstName'].value, this.teachersForm.controls['lastName'].value, this.teachersForm.controls['email'].value)
      this.httpClient.put('https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/teacher/',
      teacher,
      {
        headers: new HttpHeaders({
          'Authorization': session.getIdToken().getJwtToken(),
          'AccessToken': session.getAccessToken().getJwtToken()
        })
      }
      ).subscribe(data => {
          console.log(data)
      })
      })
    }
  }


}
