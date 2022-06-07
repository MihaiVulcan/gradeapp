import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup } from '@angular/forms';
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
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.studentsForm = this.fb.group({
      id:'',
      lastName:'',
      firstName:''
    });
  }

  onSubmit(): void{
    console.log(this.studentsForm)
    var student: Student = new Student(this.studentsForm.controls['id'].value, this.studentsForm.controls['firstName'].value, this.studentsForm.controls['lastName'].value)
    this.httpClient.post('https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/student/', student).subscribe(data => {
        console.log(data)
    })
  }

}
