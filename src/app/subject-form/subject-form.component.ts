import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup } from '@angular/forms';
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
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.subjectForm = this.fb.group({
      id:'',
      lastName:'',
      firstName:''
    });
  }

  onSubmit(): void{
    console.log(this.subjectForm)
    var subject: Subject = new Subject(this.subjectForm.controls['id'].value, this.subjectForm.controls['name'].value)
    this.httpClient.post('https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/subject/', subject).subscribe(data => {
        console.log(data)
    })
  }

}
