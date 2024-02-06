import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Usuarios } from '../../models/usuarios';
import { Sgp_roles } from 'src/app/models/sgp_roles';
import { Personas } from 'src/app/models/personas';
import { CatalogoServiceRoles } from 'src/app/services/catalogo/catalogo.service.roles';
import { CatalogoServiceUsuarios } from 'src/app/services/catalogo/catalogo.service.usuarios';
import { Departamentos } from 'src/app/models/departamentos';
import { Municipios } from 'src/app/models/municipios';
import { SeguridadService } from 'src/app/services/seguridad.service';




@Component({
  selector: 'app-seguridad',
  templateUrl: './seguridad.usuario.component.html',
  styleUrls: ['./seguridad.usuario.component.css']
})
export class SeguridadUsuarioComponent implements OnInit {

  @ViewChild('myTable') myTable!: ElementRef;
  lista_usuarios: Usuarios[] = [];
  listaDepartamentosPersonas: any;
  listaDeMunicipiosPersonas: any;
  lista_roles: Sgp_roles[] = [];
  usu!: Usuarios;
  dialog!: boolean;
  submitted!: boolean;
  rolSeleccionado: number=0;
  establecimientoSeleccionado: number=0;
  showMessages = false;
  showMessages_dialog = false;
  usuario_verificado!: Usuarios;
  msgs: Message[] = [];
  msgs_dialog: Message[] = [];
  persona_registro_para_enviar!: Personas;
  rol_para_enviar!: Sgp_roles;
  displayConfirmation = false;
  tipo_transaccion: string = '';
  personaResponsableSeleccionado: string = '';
  persona: Personas = new Personas();
  dui: string = '';
  departamentoSeleccionado_persona: string = '';
  municipioSeleccionado_persona: string = '';
  municipio_para_enviar_persona!: Municipios;
  departamento_para_enviar_persona!: Departamentos;
  public saveButtonDisabled: boolean = true; // Estado inicial del botón de guardar
  botonDesactivado: boolean = false;

  constructor(private catalogoServiceUsuarios: CatalogoServiceUsuarios,
    @Inject(DOCUMENT) private document: Document,
    private catalogoServiceRoles: CatalogoServiceRoles,
    private seguridadService: SeguridadService) {
    this.usu = new Usuarios();
    this.persona_registro_para_enviar = new Personas();
    this.rol_para_enviar = new Sgp_roles();

  }

  ngOnInit(): void {
    console.log("Estoy en usuario.component 01");
    this.catalogoServiceUsuarios.getAllUsuarios()
      .then(response => {
        console.log(response)
        this.lista_usuarios = response;
      }).catch(error => {
        console.log("Error al obtener los usuarios: " + error)
      });
    this.catalogoServiceRoles.getAllRoles()
      .then(response => {
        console.log(response)
        this.lista_roles = response;
      }).catch(error => {
        console.log("Error al obtener los roles: " + error)
      });

    

      this.seguridadService.getAllDepartamentos().
      then(res => {

        this.listaDepartamentosPersonas = res;


      }).catch(error => {
        console.log("Error al obtener los departamentos: " + error)
      });




  }


  saveUsuarios(usuario: Usuarios): void {
    this.usu = usuario;
    this.submitted = true;
    // Obtener DUI del usuario registrado
    const dui = localStorage.getItem('dui') || '';
    this.persona_registro_para_enviar.dui_persona = dui;
    this.usu.dui_usuario_que_crea = this.persona_registro_para_enviar;



    // Validar rol del usuario
    if (!this.rolSeleccionado) {
      this.msgs_dialog.push({ severity: 'error', summary: 'Error Message', detail: 'Por favor seleccione un rol.' });
      this.showMessages_dialog = true;
      return;
    }

    // Validar establecimiento del usuario
    if (!this.establecimientoSeleccionado) {
      this.msgs_dialog.push({ severity: 'error', summary: 'Error Message', detail: 'Por favor seleccione un establecimiento.' });
      this.showMessages_dialog = true;
      return;
    }

    console.log("El rol seleccionado es: " + this.rolSeleccionado);
    this.rol_para_enviar.rol_pk = this.rolSeleccionado;
    this.usu.id_rol = this.rol_para_enviar!;
    
  

    this.usu.dui_usuario=this.personaResponsableSeleccionado;
   

    // Llamar al servicio para guardar el usuario
    this.catalogoServiceUsuarios.saveUsuario(this.usu).then(resp => {
      // Agregar el usuario creado a la lista
      this.usuario_verificado = resp;
      
      // Mostrar mensaje de éxito y cerrar el diálogo
      this.msgs.push(
        { severity: 'success', summary: 'Success Message', detail: 'El usuario con nombre: ' + this.persona.nombre_completo + 'se registro correctamente' });
      this.dialog = false; // cerrar el diálogo después de actualizar el usuario
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
      this.catalogoServiceUsuarios.getAllUsuarios()
        .then(response => {
          console.log(response)
          this.lista_usuarios = response;
          //this.tableHeight;
        }).catch(error => {
          console.log("Error al obtener los modelos: " + error)
        });

    });

console.log("El nombre completo es: " + this.persona.nombre_completo);
    this.seguridadService.savePersona(this.persona).then(resp => {


      //this.msgs="La persona con DUI: "+this.persona_verificada+", se registro correctamente";



    });




  }


  leerUsuario(usuario: Usuarios) {
    this.limpiar();
    this.tipo_transaccion = "r";
    this.usu = usuario;
    this.dialog = true;
    this.rolSeleccionado = this.usu.id_rol.rol_pk;
    this.personaResponsableSeleccionado=this.usu.dui_persona.dui_persona;
    this.obtenerDatosPorDUI();

  }



  editUsuario(usuario: Usuarios): void {
    this.usu = usuario;
    this.submitted = true;
    this.rol_para_enviar.rol_pk = this.rolSeleccionado;
    this.usu.id_rol = this.rol_para_enviar;
    

    this.catalogoServiceUsuarios.editUsuario(this.usu).then(resp => {
      this.usuario_verificado = resp;
      this.msgs.push({
        severity: 'success',
        summary: 'Success Message',
        detail: 'El usuario con nombre ' + this.usuario_verificado.dui_persona.nombre_completo + ' se actualizó correctamente.'
      });
      this.dialog = false; // cerrar el diálogo después de actualizar el usuario
      const div = this.document.getElementById('card');
      div?.scrollIntoView({ behavior: 'smooth' });
      this.showMessages = true;
      this.submitted = false;
      setTimeout(() => {
        this.ocultarMensajes();
      }, 7000);

      this.catalogoServiceUsuarios.getAllUsuarios()
        .then(response => {
          console.log(response)
          this.lista_usuarios = response;
        }).catch(error => {
          console.log("Error al obtener los modelos: " + error)
        });
    });
    console.log("El municipio es: "+this.municipioSeleccionado_persona);
    this.persona.codigo_municipio_departamento.codigo_municipio_departamento=this.municipioSeleccionado_persona;
    console.log("El municipio ya en persona es: "+this.persona.codigo_municipio_departamento.nombre_municipio);
    this.seguridadService.savePersona(this.persona).then(resp => {


      //this.msgs="La persona con DUI: "+this.persona_verificada+", se registro correctamente";



    });





  }


  NewUsuarioDialog() {
    this.limpiar();
    this.tipo_transaccion = "c";
    this.dialog = true;
    this.catalogoServiceRoles.getAllRoles()
      .then(response => {
        console.log(response)
        this.lista_roles = response;
      }).catch(error => {
        console.log("Error al obtener las marcas: " + error)
      });

      



  }

  confirmarEliminacionUsuario(usuario: Usuarios) {
    this.usu = usuario;
    this.displayConfirmation = true;
  }

  eliminarUsuario() {
    console.log("El usuario en eliminar es: " + this.usu.dui_persona.nombre_completo);
    this.catalogoServiceUsuarios.deleteUsuario(this.usu.dui_usuario).then(resp => {
      this.usuario_verificado = resp;
      this.msgs.push({
        severity: 'success',
        summary: 'Success Message',
        detail: 'El usuario con nombre ' + this.usuario_verificado.dui_persona.nombre_completo + ' se elimino correctamente.'
      });
      this.displayConfirmation = false; // cerrar el diálogo después de actualizar el usuario
      const div = this.document.getElementById('card');
      div?.scrollIntoView({ behavior: 'smooth' });
      this.showMessages = true;
      this.tableHeight;
      setTimeout(() => {

        this.ocultarMensajes();

      }, 7000);

      this.catalogoServiceUsuarios.getAllUsuarios()
        .then(response => {
          console.log(response)
          this.lista_usuarios = response;
        }).catch(error => {
          console.log("Error al obtener los modelos: " + error)
        });
    });/*,
  error => {
    console.error(error);
  }).catch(error => {
    console.log("Error al obtener el menú de usuarios: " + error);
  });
*/


  }


  obtenerDatosPorDUI(): void {
    console.log("Estoy dentro de obtenerDatosPorDui");

    if(this.tipo_transaccion=='c'){
    this.catalogoServiceUsuarios.buscarUsuarioPorDui(this.personaResponsableSeleccionado).then(resp => {


      console.log("Estoy dentro del metodo03");

      this.usu = resp;
      this.rolSeleccionado=this.usu.id_rol.rol_pk;



      this.botonDesactivado = true;

      this.msgs_dialog.push(
        { severity: 'error', summary: 'Error Message', detail: 'Ya se encontro un usuario con ese número de DUI.' });
      this.showMessages_dialog = true;




    }).catch(error => {
      console.log("Error al obtener el menú de usuarios: " + error)
    });
  }





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
          this.persona.direccion_vivienda = resp.direccion_vivienda;
          this.departamentoSeleccionado_persona = resp.codigo_municipio_departamento.codigo_departamento.codigo_departamento;
          this.cargarMunicipiosPorDepartamentosPersonas(this.departamentoSeleccionado_persona);
          this.municipioSeleccionado_persona = resp.codigo_municipio_departamento.codigo_municipio_departamento;

          

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


  cargarMunicipiosPorDepartamentosPersonas(codigoDepartamento: String) {
    //var codigo="06";

    console.log("Estoy dentro del metodo02: " + codigoDepartamento);
    this.seguridadService.getAllMunicipiosPorDepartamento(codigoDepartamento).then(resp => {


      console.log("Estoy dentro del metodo03");

      this.listaDeMunicipiosPersonas = resp;


    }).catch(error => {
      console.log("Error al obtener el menú de usuarios: " + error)
    });
  }



  emailIsValid(email: string): boolean {
    // Expresión regular para validar el correo electrónico
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Usa la clase FormControl para realizar la validación
    const control = new FormControl(email);
    return control.valid && emailPattern.test(email);
  }




  get tableHeight() {
    const height = window.innerHeight;
    return `${height - 280}px`;
  }

  ocultarMensajes() {
    this.showMessages = false;
    this.msgs = [];
  }


  cancelarDialogo() {
    this.dialog = false;

    this.limpiar();
  }



  limpiar() {

    this.rolSeleccionado = 0;
    this.establecimientoSeleccionado= 0;
    this.usu = new Usuarios();
    this.tipo_transaccion = '';
  }





}
