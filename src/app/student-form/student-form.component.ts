import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AuthService } from '../auth/auth.service';
import { Student } from '../students-page/students-page.component';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})


export class StudentFormComponent implements OnInit {

  studentsForm!: FormGroup;

  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private auth: AuthService
    ) { }

  ngOnInit(): void {
    this.studentsForm = this.fb.group({
      id:'',
      lastName:'',
      firstName:'',
      codeAcademic: '',
      email: '',
      group: '',
      year: 0,
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
        this.httpClient.post('https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/student/',
        student,
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
