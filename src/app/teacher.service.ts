import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from './teacher-page-subjects/teacher-page-subjects.component';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  public id: string = ''

  constructor(private httpClient: HttpClient) { }

}
