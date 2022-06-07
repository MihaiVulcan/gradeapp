import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.css']
})
export class StudentPageComponent implements OnInit {

  id: string = ""

  constructor(private studentService: StudentService, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.id = this.auth.getUsername()
    console.log(this.id)
  }

  logOut(){
    this.auth.logOut()
    this.router.navigateByUrl('login')
  }

}
