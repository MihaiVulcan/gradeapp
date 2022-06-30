import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AuthService } from '../auth/auth.service';
import { Teacher } from '../teachers-page/teachers-page.component';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.css']
})


export class TeacherFormComponent implements OnInit {

  teachersForm!: FormGroup;

  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private auth: AuthService
    ) { }

  ngOnInit(): void {
    this.teachersForm = this.fb.group({
      id:'',
      lastName:'',
      firstName:'',
      email:''
    });
  }

  onSubmit(): void{

    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)

      console.log(this.teachersForm)
      var teacher: Teacher = new Teacher(this.teachersForm.controls['id'].value, this.teachersForm.controls['firstName'].value, this.teachersForm.controls['lastName'].value, this.teachersForm.controls['email'].value)
      this.httpClient.post('https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/teacher/',
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
