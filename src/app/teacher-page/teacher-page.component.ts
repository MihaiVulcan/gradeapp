import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TeacherService } from '../teacher.service';

@Component({
  selector: 'app-teacher-page',
  templateUrl: './teacher-page.component.html',
  styleUrls: ['./teacher-page.component.css']
})
export class TeacherPageComponent implements OnInit {

  id: string = ""

  constructor(private teacherService:TeacherService, private auth:AuthService, private router:Router) { }

  ngOnInit(): void {
    this.id = this.auth.getUsername()
    console.log(this.id)
  }

  logOut(){
    this.auth.logOut()
    this.router.navigateByUrl('login')
  }

}
