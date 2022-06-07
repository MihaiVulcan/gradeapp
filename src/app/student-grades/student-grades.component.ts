import { NumberSymbol } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AuthService } from '../auth/auth.service';
import { StudentService } from '../student.service';


export class SubjectGrade{
  constructor(
    public id: number,
    public name: string,
    public grade: number,
    public procent:number,
    public feedback: string,
    public mockGrade: number = 0
  ){}
}

export class SubjectStudent{
  constructor(
    public subjectId: string,
    public name: string,
    public grades: SubjectGrade[],
    public credits: number
  ){}
}


@Component({
  selector: 'app-student-grades',
  templateUrl: './student-grades.component.html',
  styleUrls: ['./student-grades.component.css']
})

export class StudentGradesComponent implements OnInit {

  constructor(
    private studentService: StudentService,
    private httpClient: HttpClient,
    private auth: AuthService,
    ) { }

  id: string = ""

  subjectsStudent : SubjectStudent[] = []

  selectedSubject : SubjectStudent = new SubjectStudent("","",[],0)

  displayedColumns: string[] = ["name", "procent", "grade", "feedback"]

  finalGrade = 0

  selectedGrade = new SubjectGrade(-1,"",0,0,"")

  ngOnInit(): void {
    this.id = this.auth.getUsername()
    this.loadGrades()
  }

  loadGrades(){
    var user = this.auth.getUser()
    if(user != null){
      user.getSession((err: any, session: CognitoUserSession) => {
        if(err)
          return;
        console.log(session)
        this.httpClient.get<any>("https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/student-grades/?id="+this.auth.getUsername() ,{
          headers: new HttpHeaders({
            'Authorization': session.getIdToken().getJwtToken(),
          
          })
          }).subscribe(response=>{
              console.log(response)
              this.subjectsStudent = response["body"]
              console.log(this.subjectsStudent)
            })
      })
    }
    

  }

  calculateFinalGrade(){
    var gr = 0
    console.log(this.selectedSubject.grades)
    for(var grade of this.selectedSubject.grades){
      if(grade.grade!=0)
        gr+= grade.procent/100*grade.grade
      else
        gr+= grade.procent/100*grade.mockGrade
    }

    this.finalGrade = gr
  }

  openGrades(subjectStudent: SubjectStudent){
      this.selectedGrade = new SubjectGrade(-1,"",0,0,"")
      this.selectedSubject = subjectStudent
      for(var grade of this.selectedSubject.grades){
        if(grade.grade==0)
          grade.mockGrade=0
      }
      console.log(this.selectedSubject)
      this.calculateFinalGrade()

  }

  openFeedback(grade:SubjectGrade){
    this.selectedGrade = grade
  }

}
