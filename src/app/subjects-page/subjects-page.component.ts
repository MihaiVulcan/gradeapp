import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SubjectFormComponent } from '../subject-form/subject-form.component';
import { SubjectStudentComponent } from '../subject-student/subject-student.component';
import { SubjectTeacherComponent } from '../subject-teacher/subject-teacher.component';

export class Subject {
  constructor(
    public id: string,
    public name: string,
  ){
  }
}


@Component({
  selector: 'app-subjects-page',
  templateUrl: './subjects-page.component.html',
  styleUrls: ['./subjects-page.component.css']
})
export class SubjectsPageComponent implements OnInit {

  subjects: Subject[] = [];
  dataSource = new MatTableDataSource<Subject>(this.subjects);
  displayedColumns: String[] = ['id', 'name', 'actions']
  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog
  ) { }

  @ViewChild(MatPaginator)paginator!: MatPaginator;

  ngOnInit(): void {
      this.getSubjects()
      
  }

  ngAfterViewInit(){
    this.dataSource.paginator=this.paginator
  }

  getSubjects(){
    this.httpClient.get<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/subject/?id=all').subscribe(
      response => {
        console.log(response)
        this.subjects = response.body
        this.dataSource.data = this.subjects
        console.log(this.dataSource)
        console.log(this.subjects)
      }
    )
  }

  deleteSubject(id: string){
    console.log(id);
    this.httpClient.delete<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/subject/?id='+id).subscribe(
      response => {
        console.log(response)
      })
    this.getSubjects()
  }

  onNewSubject(){
    const dialogRef = this.dialog.open(SubjectFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getSubjects();
    });
  }

  addTeacher(id: string){
    const dialogRef = this.dialog.open(SubjectTeacherComponent, {
      data: {
        "id": id
      }
    });
  }


  addStudent(id: string){
    const dialogRef = this.dialog.open(SubjectStudentComponent, {
      data: {
        "id": id
      }
    });
  }

}
