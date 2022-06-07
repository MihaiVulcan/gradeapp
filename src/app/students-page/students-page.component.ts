import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StudentFormComponent } from '../student-form/student-form.component';

export class Student {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string
  ){
  }
}

@Component({
  selector: 'app-students-page',
  templateUrl: './students-page.component.html',
  styleUrls: ['./students-page.component.css']
})


export class StudentsPageComponent implements OnInit {

  students: Student[] = [];
  dataSource = new MatTableDataSource<Student>(this.students);
  displayedColumns: String[] = ['id', 'lastName', 'firstName', 'actions']
  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog
  ) { }

  @ViewChild(MatPaginator)paginator!: MatPaginator;

  ngOnInit(): void {
      this.getStudents()
      
      
  }

  ngAfterViewInit(){
    this.dataSource.paginator=this.paginator
  }

  getStudents(){
    this.httpClient.get<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/student/?id=all').subscribe(
      response => {
        console.log(response)
        this.students = response.body
        this.dataSource.data = this.students
        console.log(this.dataSource)
        console.log(this.students)
      }
    )
  }

  deleteStudent(id: string){
    console.log(id);
    this.httpClient.delete<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/student/?id='+id).subscribe(
      response => {
        console.log(response)
      })
    this.getStudents()
  }

  onNewStudent(){
    const dialogRef = this.dialog.open(StudentFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getStudents();
    });
  }

}
