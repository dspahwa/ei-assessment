import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { WebRequestsService } from './web-requests.service';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentEmailUser: string;

  constructor(
    private http: HttpClient,
    private reqService: WebRequestsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login(email: string, password: string) {
    return this.reqService.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        console.log('sess-', res)
        this.setSession(
          res.body._id,
          res.headers.get('x-access-token'),
          res.headers.get('x-refresh-token')
        );
        this.toastr.success('Welcome!', 'Login Successfuly!');

        this.router.navigate(['/']);
      }),
      catchError((error) => {
        // Check for invalid email/password error (typically a 401 or 400 error)
        if (error.status === 401 || error.status === 400) {
          this.toastr.error('Invalid email or password. Please try again.', 'Login Failed');
        } else {
          this.toastr.error('An unexpected error occurred. Please try again later.', 'Error');
        }
        
        return throwError(error); // Re-throw the error if further handling is needed
      })
    );
  }

  signup(name: string, email: string, password: string) {
    return this.reqService.signup(name, email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(
          res.body._id,
          res.headers.get('x-access-token'),
          res.headers.get('x-refresh-token')
        );
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        // Handle server-side errors
        if (error.status === 400) {
          this.toastr.error('Invalid name or email or password length should be min 8 characters', 'Signup Error');
        } else {
          this.toastr.error('An unexpected error occurred', 'Signup Error');
        }
        return throwError(error);
      })
    );
  }

  getRefreshToken = () => localStorage.getItem('x-refresh-token');

  getAccessToken = () => localStorage.getItem('x-access-token');

  getUserId = () => localStorage.getItem('user-id');

  setAccessToken = (accessToken: string) =>
    localStorage.setItem('x-access-token', accessToken);

  logout() {
    this.removeSession();
    this.router.navigate(['/login']);
  }

  private setSession(
    userId: string,
    accessToken: string,
    refreshToken: string
  ) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccessToken() {
    return this.http
      .get(`${this.reqService.ROOT_URL}/users/me/access-token`, {
        headers: {
          'x-refresh-token': this.getRefreshToken(),
          _id: this.getUserId(),
        },
        observe: 'response',
      })
      .pipe(
        tap((res: HttpResponse<any>) => {
          this.setAccessToken(res.headers.get('x-access-token '));
        })
      );
  }
}
