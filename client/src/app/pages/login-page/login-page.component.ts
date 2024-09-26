import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  public error:string = '';

  ngOnInit(): void {}

  onLogin(email: string, password: string) {
    if(!email){
      this.error = 'Please enter your email';
      return;
    }
    if(!password){
      this.error = 'Please enter your password';
      return;
    }
    this.authService
      .login(email, password)
      .subscribe((res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.router.navigate(['/']);
        } else {
          this.error = 'Email or Password is invalid';
        }
      });
  }
}
