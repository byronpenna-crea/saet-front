import { Component,OnInit, Inject } from '@angular/core';
import { SeguridadService } from '../../services/seguridad.service';
import { Message } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
import { Usuarios_login } from 'src/app/models/usuarios_login';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  template:'<p-messages [(value)]="msgs"></p-messages>'
})
export class LoginComponent implements OnInit {
  msgs: Message[] = [];
  showMessages=false;
  usuario:Usuarios_login=new Usuarios_login();
  privateIPAddress: string = '';
  msgs_dialog: Message[] = [];
  showMessages_dialog = false;

  constructor(

    private seguridadService:SeguridadService,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private cookieService: CookieService

  ){

  }



  ngOnInit(): void {



  }



  /*
  //Version 1
    validarUsuario(us: Usuarios_login) {



      this.seguridadService.validarUsuario(us.usuario, us.contrasena).subscribe(resp => {

        this.cookieService.set('token',resp);

      }
      , error => {
        this.msgs_dialog=[];
        //console.error(error);
        this.msgs_dialog.push(
          { severity: 'error', summary: 'Error Message', detail: 'Credenciales incorrectas.' });
        this.showMessages_dialog = true;
      });
    }

    */

  validarUsuario(us: Usuarios_login) {
    this.seguridadService.validarUsuario(us.usuario, us.contrasena).subscribe(
      (resp) => {
        // Autenticación exitosa
        this.cookieService.set('token', resp);
        ////////////this.router.navigate(['/inicio']); // Redirigir a la página deseada después de la autenticación exitosa
      },
      (error) => {
        // Error de autenticación
        if (error.status === 401) {
          // Credenciales incorrectas
          this.msgs_dialog = [];
          this.msgs_dialog.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'Credenciales incorrectas.'
          });
          this.showMessages_dialog = true; // Mostrar mensaje de error
        } else {
          // Otro tipo de error (puedes manejarlo según tus necesidades)
          console.error(error);
          // Aquí puedes mostrar un mensaje de error genérico si es necesario
          this.msgs_dialog = [];
          this.msgs_dialog.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'Ha ocurrido un error. Por favor, intenta nuevamente más tarde.'
          });
          this.showMessages_dialog = true; // Mostrar mensaje de error
        }
      }
    );
  }




  /*
    encriptarContrasena(): string {
      const input = this.contrasena01;
      const hashedPassword = crypto.createHash('sha256').update(input).digest('hex');
      return hashedPassword;
    }

  */



  /*
  validarUsuario(us: Usuarios_login) {
    console.log("Estoy dentro del login01, el usuario y password que envio es: "+us.usuario+", "+us.contrasena);

    this.seguridadService.validarUsuario(us.usuario, us.contrasena).subscribe(resp => {
      console.log("Dentro de respuesta",resp)
      const jsonResponse = resp.body;
      this.cookieService.set('token', jsonResponse.token);
      const nombre = jsonResponse.nombre;
        console.log("El valor del nombre es: " + nombre)
        localStorage.setItem('nombre', nombre);

      // const token = resp.body.get('token');

      //localStorage.setItem('token', token);
      // Resto del código aquí
    }, error => {
      console.error(error);
    });
  }


  */



}

