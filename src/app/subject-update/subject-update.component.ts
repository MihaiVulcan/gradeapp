import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AuthService } from '../auth/auth.service';
import { Subject } from '../subjects-page/subjects-page.component';

@Component({
  selector: 'app-subject-update',
  templateUrl: './subject-update.component.html',
  styleUrls: ['./subject-update.component.css']
})
export class SubjectUpdateComponent implements OnInit {

  subjectForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private auth: AuthService
    ) { }

  ngOnInit(): void {
    this.subjectForm = this.fb.group({
      id:this.data.subject['id'],
      name:this.data.subject['name'],
      credits:this.data.subject['credits'],
      semester:this.data.subject['semester']
    });
  }

  onSubmit(): void{
    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)

        console.log(this.subjectForm)
        var subject: Subject = new Subject(this.subjectForm.controls['id'].value, this.subjectForm.controls['name'].value, this.subjectForm.controls['semester'].value, this.subjectForm.controls['credits'].value)
        this.httpClient.put('https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/subject/',
        subject,
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
