import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
}from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SeguridadService } from './services/seguridad.service';







@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService, private router: Router,private seguridadService:SeguridadService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {


    const token: string = this.cookieService.get('token');
    const tokendos: string | null = localStorage.getItem('token');
    let req=request;
    if (token) {

      req=request.clone({
setHeaders:{
  Authorization: 'Bearear '+tokendos
}
      });
    }

    return next.handle(req); // agrego return statement
  }


}
