import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AuthService } from '../auth/auth.service';
import { Subject } from '../subjects-page/subjects-page.component';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.css']
})


export class SubjectFormComponent implements OnInit {

  subjectForm!: FormGroup;

  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private auth: AuthService
    
    ) { }

  ngOnInit(): void {
    this.subjectForm = this.fb.group({
      id:'',
      lastName:'',
      firstName:''
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
        var subject: Subject = new Subject(this.subjectForm.controls['id'].value, this.subjectForm.controls['name'].value)
        this.httpClient.post('https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/subject/',
        subject,
        {
          headers: new HttpHeaders({
            'Authorization': session.getIdToken().getJwtToken(),
          })
        }
        ).subscribe(data => {
            console.log(data)
        })
      })
    }
  }

}
