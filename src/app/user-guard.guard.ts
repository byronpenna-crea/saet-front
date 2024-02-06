import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserGuardGuard implements CanActivate {


  constructor(

     private cookieService: CookieService,
     private router: Router,

    ){

   }



  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const cookie=this.cookieService.check('token')
    //console.log("Estoy en can: ",cookie);
    if(!cookie){
      this.router.navigate( ['/', 'login'])
      //console.log("Estoy en el guard");
    }else{

      //console.log("Estoy en else del guard");

      return true

    }

    return true


  }

}
