import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup } from '@angular/forms';
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
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.teachersForm = this.fb.group({
      id:'',
      lastName:'',
      firstName:''
    });
  }

  onSubmit(): void{
    console.log(this.teachersForm)
    var teacher: Teacher = new Teacher(this.teachersForm.controls['id'].value, this.teachersForm.controls['firstName'].value, this.teachersForm.controls['lastName'].value)
    this.httpClient.post('https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/teacher/', teacher).subscribe(data => {
        console.log(data)
    })
  }

}
