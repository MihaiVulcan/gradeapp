import { Injectable } from '@angular/core';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  poolData = {
    UserPoolId: environment.cognitoUserPoolId,
    ClientId: environment.cognitoAppClientId
  };

  userPool = new CognitoUserPool(this.poolData);

  getGroup(): string{
    var group = ""

    console.log("get user type")
    var cognitoUser = this.userPool.getCurrentUser()
    console.log(cognitoUser)
    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
        }
        else{
          var sessionIdInfo = jwt_decode<any>(session.getIdToken().jwtToken);
          group=sessionIdInfo['cognito:groups'][0]
          console.log(group);
        }
      })
    }
    return group
  } 

  getUsername(){
    var username = ""
    var cognitoUser = this.userPool.getCurrentUser()
    if(cognitoUser != null){
      console.log(cognitoUser)
      username = cognitoUser.getUsername()
    }
    return username;
  }

  logOut(){
    let cognitoUser = this.userPool.getCurrentUser();
    cognitoUser?.signOut();
  }

  isLoggedIn(): any {
    var isAuth = false;

    var cognitoUser = this.userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
        }
        isAuth = session.isValid()
      })
    }
    return isAuth;
  }

  getUser(): CognitoUser | null{
    return this.userPool.getCurrentUser();
  }
}
