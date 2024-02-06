import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
import { Personas } from 'src/app/models/personas';
import { Placas } from 'src/app/models/placas';
import { CatalogoServicePlacas } from 'src/app/services/catalogo/catalogo.service.placas';
import { SeguridadService } from 'src/app/services/seguridad.service';


@Component({
  selector: 'app-placa',
  templateUrl: './placa.component.html',
  styleUrls: ['./placa.component.css']
})
export class PlacaComponent implements OnInit {
  @ViewChild('myTable') myTable!: ElementRef;
  lista_placa: Placas[] = [];
  pla!: Placas;
  dialog!: boolean;
  dialog_buscar!: boolean;
  submitted!: boolean;
  showMessages = false;
  showMessages_dialog = false;
  placa_verificada!: Placas;
  msgs: Message[] = [];
  msgs_dialog: Message[] = [];
  //persona!: Personas;
  persona_registro_para_enviar!: Personas;
  persona_responsable_para_enviar!: Personas;
  personaResponsableSeleccionado: string = '';
  displayConfirmation = false;
  tipo_transaccion: string = '';
  persona: Personas = new Personas();
  dui:string='';
  public saveButtonDisabled: boolean = true; // Estado inicial del botón de guardar

  constructor(private catalogoServicePlacas: CatalogoServicePlacas,
    private seguridadService: SeguridadService,
    @Inject(DOCUMENT) private document: Document) {
    this.pla = new Placas();
    this.persona_registro_para_enviar = new Personas();
    this.persona_responsable_para_enviar = new Personas();

  }


  ngOnInit(): void {
    console.log("Estoy en placa.component 01");
    this.catalogoServicePlacas.getAllPlacas()
      .then(response => {
        console.log(response)
        this.lista_placa = response;
      }).catch(error => {
        console.log("Error al obtener las placas: " + error)
      });



  }

  savePlaca(placa: Placas): void {
    this.pla = placa;

    this.catalogoServicePlacas.obtenerDatosPorPlaca(this.pla.numero_placa).then(resp => {

      this.msgs_dialog.push(
        { severity: 'error', summary: 'Error Message', detail: 'Ya se encontraron registros con ese número de placa.' });
      this.showMessages_dialog = true;

      this.saveButtonDisabled = true;

  }).catch(error => {

    this.submitted = true;
    const dui = localStorage.getItem('dui') || '';
    console.log("Estoy dentro de guardar 01, el dui es " + dui);
    this.persona_registro_para_enviar.dui_persona = dui;
    this.pla.dui_usuario_registra_placa = this.persona_registro_para_enviar;


    if (!this.pla.numero_placa) {
      this.msgs_dialog.push(
        { severity: 'error', summary: 'Error Message', detail: 'Por favor ingrese un numero de placa.' });
      this.showMessages_dialog = true;
      return;
    }

    if (!this.personaResponsableSeleccionado) {
      this.msgs_dialog.push(
        { severity: 'error', summary: 'Error Message', detail: 'Por favor ingrese un DUI.' });
      this.showMessages_dialog = true;
      return;
    }


    if (!this.persona.celular_personal) {
      this.msgs_dialog.push(
        { severity: 'error', summary: 'Error Message', detail: 'Por favor ingrese el numero de celular personal.' });
      this.showMessages_dialog = true;
      return;
    }

    if (!this.persona.telefono_fijo_trabajo) {
      this.msgs_dialog.push(
        { severity: 'error', summary: 'Error Message', detail: 'Por favor ingrese el telefono fijo del trabajo.' });
      this.showMessages_dialog = true;
      return;
    }


    this.showMessages_dialog = false;

    this.persona_responsable_para_enviar.dui_persona = this.personaResponsableSeleccionado;
    this.pla.dui_persona_responsable = this.persona_responsable_para_enviar;

    this.catalogoServicePlacas.savePlaca(this.pla).then(resp => {
      this.placa_verificada = resp;
      this.msgs.push(
        { severity: 'success', summary: 'Success Message', detail: 'La placa: ' + this.placa_verificada.numero_placa + ' se registró correctamente' });
      this.dialog = false;
      const div = this.document.getElementById('card');
      div?.scrollIntoView({ behavior: 'smooth' });
      this.showMessages = true;
      this.tableHeight;
      this.submitted = false;
      setTimeout(() => {
        this.ocultarMensajes();
      }, 7000);
      // Limpiar el objeto de persona responsable para el próximo uso
      this.persona_registro_para_enviar = new Personas();

      this.catalogoServicePlacas.getAllPlacas()
        .then(response => {
          console.log(response)
          this.lista_placa = response;
        }).catch(error => {
          console.log("Error al obtener las placas: " + error)
        });

    });
    this.seguridadService.savePersona(this.persona).then(resp => {


      //this.msgs="La persona con DUI: "+this.persona_verificada+", se registro correctamente";



    });

  });


  }

  leerPlaca(pla: Placas) {
    this.limpiar();
    this.tipo_transaccion = "r";
    this.pla = pla;
    this.dialog = true;
    this.personaResponsableSeleccionado = pla.dui_persona_responsable.dui_persona;
    this.obtenerDatosPorDUI();

  }

  editPlaca(placa: Placas): void {
    this.pla = placa;


    if (!this.pla.numero_placa) {
      this.msgs_dialog.push(
        { severity: 'error', summary: 'Error Message', detail: 'Por favor ingrese un nombre de placa.' });
      this.showMessages_dialog = true;
      return;
    }

    if (!this.personaResponsableSeleccionado) {
      this.msgs_dialog.push(
        { severity: 'error', summary: 'Error Message', detail: 'Por favor ingrese un DUI.' });
      this.showMessages_dialog = true;
      return;
    }
    this.persona_responsable_para_enviar.dui_persona = this.personaResponsableSeleccionado;
    this.pla.dui_persona_responsable = this.persona_responsable_para_enviar;
    this.submitted = true;
    this.catalogoServicePlacas.editPlaca(this.pla).then(resp => {
      this.placa_verificada = resp;
      this.msgs.push({
        severity: 'success',
        summary: 'Success Message',
        detail: 'La placa con nombre ' + this.placa_verificada.numero_placa + ' se actualizó correctamente.'
      });
      this.dialog = false; // cerrar el diálogo después de actualizar la placa
      const div = this.document.getElementById('card');
      div?.scrollIntoView({ behavior: 'smooth' });
      this.showMessages = true;
      this.submitted = false;
      setTimeout(() => {
        this.ocultarMensajes();
      }, 7000);

      this.catalogoServicePlacas.getAllPlacas()
        .then(response => {
          console.log(response)
          this.lista_placa = response;
        }).catch(error => {
          console.log("Error al obtener las placas: " + error)
        });
    });/*,
    error => {
      console.error(error);
    }).catch(error => {
      console.log("Error al obtener el menú de usuarios: " + error);
    });*/

    this.seguridadService.savePersona(this.persona).then(resp => {


      //this.msgs="La persona con DUI: "+this.persona_verificada+", se registro correctamente";



    });


  }


  NewPlacaDialog() {
    this.limpiar();
    this.tipo_transaccion = "c";
    this.dialog = true;



    //this.pla = new Placas();
    /*
    this.catalogoServicePlacas.getAllPlacas().then(response=>{
      console.log(response);
      this.lista_placa = response;
    }).catch(error => {
      console.log("Error al obtener las placas: " + error)
    });
  */
    /*
    this.seguridadService.getAllUsuarios().then(res=>{
      this.listaUsuarios = res;
    }).catch(error => {
      console.log("Error al obtener el menú de usuarios: " + error)
    });

*/

    console.log("Estoy en NewPlacaDialog");

  }


  BuscarPlacaDialog() {
    this.limpiar();
    this.dialog_buscar = true;


  }




  confirplaEliminacionPlaca(placa: Placas) {
    this.pla = placa;
    this.displayConfirmation = true;
  }

  eliminarPlaca() {
    this.catalogoServicePlacas.deletePlaca(this.pla.id_placa).then(resp => {
      this.placa_verificada = resp;
      this.msgs.push({
        severity: 'success',
        summary: 'Success Message',
        detail: 'La placa con nombre ' + this.placa_verificada.numero_placa + ' se eliminó correctamente.'
      });
      this.displayConfirmation = false;
      const div = this.document.getElementById('card');
      div?.scrollIntoView({ behavior: 'smooth' });
      this.showMessages = true;
      this.tableHeight;
      setTimeout(() => {
        this.ocultarMensajes();
      }, 7000);
      this.catalogoServicePlacas.getAllPlacas()
        .then(response => {
          console.log(response);
          this.lista_placa = response;
        }).catch(error => {
          console.log("Error al obtener las placas: " + error);
        });
    });/*,
    error => {
      console.error(error);
    }).catch(error => {
      console.log("Error al obtener el menú de usuarios: " + error);
    });*/


  }


  get tableHeight() {
    const height = window.innerHeight;
    return `${height - 280}px`;
  }

  ocultarMensajes() {
    this.showMessages = false;
    this.msgs = [];
    this.showMessages_dialog=false;
    this.msgs_dialog = []; // Limpiar la variable msgs_dialog
  }

  cancelarDialogo() {
    this.dialog = false;
    this.dialog_buscar = false;

    this.limpiar();
  }



  obtenerDatosPorDUI(): void {
  console.log("Estoy dentro de obtenerDatosPorDui");
    this.dui = this.personaResponsableSeleccionado;
    if (this.dui) {
      this.seguridadService.obtenerDatosPorDUI(this.dui).then(resp => {
         // Habilitar el botón de guardar específico
         this.ocultarMensajes();
         this.saveButtonDisabled = false;
        // Verifica si se obtuvieron datos válidos del backend
        if (resp && resp.nombre && resp.apellido) {
          // Asigna los datos recibidos al objeto persona
          this.persona.dui_persona = resp.dui_persona;
          this.persona.nombre = resp.nombre;
          this.persona.apellido = resp.apellido;
          this.persona.nombre_completo = resp.nombre_completo;
          this.persona.celular_personal = resp.celular_personal ? resp.celular_personal.trim() : '';
          this.persona.telefono_fijo_trabajo = resp.telefono_fijo_trabajo ? resp.telefono_fijo_trabajo.trim() : '';
          // Campos no actualizados
          this.persona.institucion = resp.institucion;
          this.persona.plaza = resp.plaza;
          this.persona.salario = resp.salario;
          this.persona.tipo_contrato = resp.tipo_contrato;
          this.persona.celular_trabajo = resp.celular_trabajo;
          this.persona.telefono_fijo_casa = resp.telefono_fijo_casa;
          this.persona.correo_personal = resp.correo_personal;
          this.persona.correo_trabajo = resp.correo_trabajo;
          this.persona.fecha_nacimiento = resp.fecha_nacimiento;
          this.persona.codigo_municipio_departamento = resp.codigo_municipio_departamento;
          this.persona.sexo = resp.sexo;

          // ...
        } else {
          // No se encontraron datos para el DUI ingresado
          // Realiza alguna acción o muestra un mensaje de error




        }
      }).catch(error => {
        //console.error(error);
        // Maneja el error de la solicitud

        this.msgs_dialog.push(
          { severity: 'error', summary: 'Error Message', detail: 'No se encontraron datos con este DUI, favor contacta al administrador al 70004718.' });
        this.showMessages_dialog = true;
        this.persona = new Personas();
        this.saveButtonDisabled = true;
        return;


      });
    }
  }

  obtenerDatosPorPlaca(): void {
    console.log("Estoy dentro de obtenerDatosPorPlaca 01:");
    this.catalogoServicePlacas.obtenerDatosPorPlaca(this.pla.numero_placa).then(resp => {
    this.personaResponsableSeleccionado=resp.dui_persona_responsable.dui_persona;
    console.log("Estoy dentro de obtenerDatosPorPlaca 02:"+this.personaResponsableSeleccionado);
    this.obtenerDatosPorDUI();
    }).catch(error => {
        //console.error(error);
        // Maneja el error de la solicitud

        this.msgs_dialog.push(
          { severity: 'error', summary: 'Error Message', detail: 'No se encontraron registros con ese número de placa.' });
        this.showMessages_dialog = true;
        this.persona = new Personas();
        this.saveButtonDisabled = true;
        return;


      });


  }


  limpiar() {
    console.log("Estoy en limpiar");
    this.pla = new Placas();
    this.tipo_transaccion = '';
    this.persona=new Personas();
    this.dui='';
    this.personaResponsableSeleccionado='';
    this.showMessages_dialog=false;
    this.msgs_dialog = []; // Limpiar la variable msgs_dialog



  }



}
