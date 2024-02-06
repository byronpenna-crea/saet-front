import { Departamentos } from 'src/app/models/departamentos';
import { Municipios } from 'src/app/models/municipios';
import { Personas } from 'src/app/models/personas';
import { SeguridadService } from '../../../services/seguridad.service';
import { Message } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from 'src/app/services/ThemeService';
import { Component, OnInit,Inject } from '@angular/core';



@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css'],
  template:'<p-messages [(value)]="msgs"></p-messages>'
})

export class PersonaComponent implements OnInit{


  listaDepartamentos: any;
  listaDeMunicipios: any;
  municipio!:Municipios;
  municipio_para_enviar!:Municipios;
  departamento_para_enviar!:Departamentos;
  //persona!: Personas;
  persona_verificada!:Personas;
  msgs: Message[] = [];
  showMessages=false;
  isDarkMode!: boolean;
  persona:Personas=new Personas();

  constructor(

    private seguridadService:SeguridadService,
    @Inject(DOCUMENT) private document: Document,
    private themeService:ThemeService




    ){


   }

   ngOnInit(): void {



    this.seguridadService.getAllDepartamentos().
    then(res=>{

    this.listaDepartamentos=res;

    //console.log(res);




    }).catch(error => {
      console.log("Error al obtener el menú de usuarios: " + error)
    });


      }


      guardarPersona(persona:Personas):void{


        console.log("Estoy dentro de guardar persona 01, el dui es: "+persona.dui_persona);

        console.log("El codigo mun de persona es: "+persona.codigo_municipio_departamento);


        this.seguridadService.savePersona(persona).then(resp=>{
        this.persona_verificada=resp;
        this.msgs.push(
          { severity: 'success', summary: 'Success Message', detail: 'La persona con nombre: '+this.persona_verificada.nombre_completo+', y DUI: '+this.persona_verificada.dui_persona+' se registro correctamente' });

          this.showMessages=true;
          const div=this.document.getElementById('div_persona_principal');
          div?.scrollIntoView({behavior:'smooth'})
          //const formPersona=this.document.getElementById('frm_persona') as HTMLFormElement;
          //formPersona.reset;
          this.persona=new Personas();

          setTimeout(()=>{
          this.ocultarMensajes();
        },7000);

        //this.msgs="La persona con DUI: "+this.persona_verificada+", se registro correctamente";
        console.log("La respuesta es: "+this.persona_verificada.dui_persona);
        console.log(persona.codigo_municipio_departamento);

        },
        error=>{console.error(error)}
        ).catch(error => {
          console.log("Error al obtener el menú de usuarios: " + error)
        });

      }


      ocultarMensajes() {
        this.showMessages = false;
        this.msgs = [];
      }



      cargarMunicipiosPorDepartamentos(event:any){
       //var codigo="06";

       console.log("Estoy dentro del metodo02: "+event.target.value);
       this.seguridadService.getAllMunicipiosPorDepartamento(event.target.value).then(resp=>{


        console.log("Estoy dentro del metodo03");

        this.listaDeMunicipios=resp;




      }).catch(error => {
        console.log("Error al obtener el menú de usuarios: " + error)
      });
      }


// ...

obtenerDatosPorDUI(): void {
  const dui = this.persona.dui_persona;
  if (dui) {
    this.seguridadService.obtenerDatosPorDUI(dui).then(resp => {
      // Verifica si se obtuvieron datos válidos del backend
      if (resp && resp.nombre && resp.apellido) {
        // Asigna los datos recibidos al objeto persona
        this.persona.nombre = resp.nombre;
        this.persona.apellido = resp.apellido;
        // Asigna otros campos de datos según sea necesario
        // ...
      } else {
        // No se encontraron datos para el DUI ingresado
        // Realiza alguna acción o muestra un mensaje de error
      }
    }).catch(error => {
      console.error(error);
      // Maneja el error de la solicitud
    });
  }
}

// ...






}
