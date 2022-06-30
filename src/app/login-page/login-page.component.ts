import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../student.service';
import { TeacherService } from '../teacher.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";

export class Result{
  constructor(
  public statusCode:string,
  public error: string
  ){}
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  isLoading: boolean = false;
  username: string = "";
  password: string = "";
  newPasswordRequired: boolean = false;
  newPassword: string = "";
  newPasswordConfirm: string = "";

  cognitoUser!: CognitoUser;

  sessionUserAttributes={};

  newPasswordForm : FormGroup = new FormGroup({
    newPassword: new FormControl(this.newPassword,[
      Validators.required,
      Validators.minLength(4)
    ]),
    newPasswordConfirm: new FormControl(this.newPasswordConfirm,[
      Validators.required,
      Validators.minLength(4)
    ]),
  })

  loginForm: FormGroup = new FormGroup({
    username: new FormControl( this.username, [
      Validators.required,
      Validators.minLength(4)
    ] ),
    password: new FormControl(this.password, [
      Validators.required,
      Validators.minLength(4)
    ])
  })

  constructor(private teacherService: TeacherService, private studentService: StudentService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    var result = this.authService.isLoggedIn()
    if(result != false){
      this.loadUserInterface();
    }
  }

  loadUserInterface() {
    var group = this.authService.getGroup()
    if(group=="admin"){
      this.router.navigateByUrl('/admin-page/home')
    }
    else if(group=="student"){
      this.router.navigateByUrl('/student-page/home')
    }
    else if(group=="teacher"){
      this.router.navigateByUrl('/teacher-page/home')
    }else{
      alert("User is not part of any group")
    }
  }

  onSignIn(){
    console.log("login Pressed")
    if (this.loginForm.valid) {
      console.log("form valid")
      this.isLoading = true;
      let authenticationDetails = new AuthenticationDetails({
          Username: this.username,
          Password: this.password,
      });
      let poolData = {
        UserPoolId: environment.cognitoUserPoolId, // Your user pool id here
        ClientId: environment.cognitoAppClientId // Your client id here
      };

      let userPool = new CognitoUserPool(poolData);
      let userData = { Username: this.username, Pool: userPool };
      this.cognitoUser = new CognitoUser(userData);
      this.cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          console.log(result)
          this.loadUserInterface()
        },
        onFailure: (err) => {
          console.log(err)
          alert(err.message || JSON.stringify(err));
          this.isLoading = false;
        },
        newPasswordRequired:(userAttributes, requiredAttributes) =>{
          console.log("New password required")
          console.log(userAttributes, requiredAttributes)
          this.newPasswordRequired = true;

          delete userAttributes.email_verified

          delete userAttributes.email

          this.sessionUserAttributes = userAttributes
        }
      });
    }
    else{
      console.log(this.loginForm.getRawValue())
      console.log("Form not valid")
    }
  }


  setNewPassword(){
    console.log("new Password press");
    if(this.newPasswordForm.valid && this.newPassword==this.newPasswordConfirm){
      console.log("new Passwords valid and passwords match")
      this.cognitoUser.completeNewPasswordChallenge(this.newPassword, this.sessionUserAttributes,{
        onSuccess: (result) =>{
          console.log(result)
          this.loadUserInterface()
        },
        onFailure: (error)=>{
          alert("New Password could not be set")
          console.log(error)
        }
      });
    }
    else{
      alert("Passwords do not match")
    }
  }

}
