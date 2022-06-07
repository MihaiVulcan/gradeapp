import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TeacherFormComponent } from '../teacher-form/teacher-form.component';

export class Teacher {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string
  ){
  }
}

@Component({
  selector: 'app-teachers-page',
  templateUrl: './teachers-page.component.html',
  styleUrls: ['./teachers-page.component.css']
})


export class TeachersPageComponent implements OnInit {

  teachers: Teacher[] = [];
  dataSource = new MatTableDataSource<Teacher>(this.teachers);
  displayedColumns: String[] = ['id', 'lastName', 'firstName', 'actions']
  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog
  ) { }

  @ViewChild(MatPaginator)paginator!: MatPaginator;

  ngOnInit(): void {
      this.getTeachers()
  }

  ngAfterViewInit(){
    this.dataSource.paginator=this.paginator
  }

  getTeachers(){
    this.httpClient.get<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/teacher/?id=all').subscribe(
      response => {
        console.log(response)
        this.teachers = response.body
        this.dataSource.data = this.teachers
        console.log(this.dataSource)
        console.log(this.teachers)
      }
    )
  }

  deleteTeacher(id: string){
    console.log(id);
    this.httpClient.delete<any>( 'https://tuhd7q6w3a.execute-api.eu-central-1.amazonaws.com/dev/teacher/?id='+id).subscribe(
      response => {
        console.log(response)
      })
    this.getTeachers()
  }

  onNewTeacher(){
    const dialogRef = this.dialog.open(TeacherFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getTeachers();
    });
  }

}
