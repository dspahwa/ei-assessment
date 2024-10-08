import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WebRequestsService {
  readonly ROOT_URL;
  constructor(private http: HttpClient) {
    //this.ROOT_URL = '/api';
    this.ROOT_URL = 'http://localhost:3000/api';
  }

  get = (uri: string) => this.http.get(`${this.ROOT_URL}/${uri}`);

  post = (uri: string, payload) =>
    this.http.post(`${this.ROOT_URL}/${uri}`, payload);

  patch = (uri: string, payload) =>
    this.http.patch(`${this.ROOT_URL}/${uri}`, payload);

  delete = (uri: string) => this.http.delete(`${this.ROOT_URL}/${uri}`);

  login = (email: string, password: string) =>
    this.http.post(
      `${this.ROOT_URL}/users/login`,
      { email, password },
      { observe: 'response' }
    );

  signup = (name: string, email: string, password: string) =>
    this.http.post(
      `${this.ROOT_URL}/users`,
      { name, email, password },
      { observe: 'response' }
    );
}
