import { Component, OnInit, Inject , ElementRef, ViewChild} from '@angular/core';
import { Message } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
import { Personas } from 'src/app/models/personas';
import { Categorias } from 'src/app/models/categorias';
import { CatalogoServiceCategorias } from 'src/app/services/catalogo/catalogo.service.categorias';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit{
  @ViewChild('myTable') myTable!: ElementRef;
  lista_categorias:Categorias[]=[];
  cap!:Categorias;
  dialog!: boolean;
  submitted!: boolean;
  showMessages=false;
  showMessages_dialog=false;
  categoria_verificada!:Categorias;
  msgs: Message[] = [];
  msgs_dialog: Message[] = [];
  //persona!: Personas;
  persona_registro_para_enviar!:Personas;
  displayConfirmation = false;
  tipo_transaccion: string ='';
  estado_categoria_seleccionado: string ='';
  lista_estados_categorias: any[] = [
    { label: 'Seleccione un estado', value: '0' },
    { label: 'Activo', value: '1' },
    { label: 'Inactivo', value: '2' }
  ];




  constructor(private catalogoServiceCategorias:CatalogoServiceCategorias,
  @Inject(DOCUMENT) private document: Document){
  this.cap = new Categorias();
  this.persona_registro_para_enviar = new Personas();


  }


  ngOnInit(): void {
    this.catalogoServiceCategorias.getAllCategorias()
    .then(response=>{
    console.log(response)
    this.lista_categorias=response;
    }).catch(error => {
    console.log("Error al obtener las categorias: " + error)
    });



  }

  saveCategoria(categoria_proveedor:Categorias): void {
    this.cap=categoria_proveedor;
    this.submitted = true;
    const dui = localStorage.getItem('dui') || '';
    this.persona_registro_para_enviar.dui_persona = dui;
    this.cap.dui_usuario_registra_categoria = this.persona_registro_para_enviar;

    this.cap.estado_categoria=parseInt(this.estado_categoria_seleccionado);

    if (!this.cap.nombre_categoria) {
      this.msgs_dialog.push(
        { severity: 'error', summary: 'Error Message', detail: 'Por favor ingrese un nombre de categoria de proveedor.' });
      this.showMessages_dialog = true;
      return;
    }

    if (!this.cap.descripcion_categoria) {
      this.msgs_dialog.push(
        { severity: 'error', summary: 'Error Message', detail: 'Por favor ingrese una descripción para la categoria del proveedor.' });
      this.showMessages_dialog = true;
      return;
    }
    this.showMessages_dialog=false;
    this.catalogoServiceCategorias.saveCategoria(this.cap).then(resp => {
      this.categoria_verificada = resp;
      this.msgs.push(
        { severity: 'success', summary: 'Success Message', detail: 'La categoria proveedor con nombre: ' + this.categoria_verificada.nombre_categoria + ' se registró correctamente' });
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

      this.catalogoServiceCategorias.getAllCategorias()
        .then(response => {
          console.log(response)
          this.lista_categorias = response;
        }).catch(error => {
          console.log("Error al obtener las categorias: " + error)
        });

    });/*,
      error => { console.error(error) }
    ).catch(error => {
      console.log("Error al obtener el menú de usuarios: " + error)
    });*/
  }

  leerCategoria(cap:Categorias) {
    this.limpiar();
    this.estado_categoria_seleccionado=cap.estado_categoria.toString();
    console.log("El estado en leer es: "+this.estado_categoria_seleccionado);
    this.tipo_transaccion="r";
    this.cap = cap;
    this.dialog = true;

  }

  editCategoria(categoria_proveedor: Categorias): void {
    this.cap=categoria_proveedor;
    this.submitted = true;
    console.log("El estado en editar 01 es: "+this.cap.estado_categoria);
    console.log("El estado en editar 02 es: "+this.estado_categoria_seleccionado);
    console.log("El estado en editar 03 es: "+categoria_proveedor.estado_categoria);
    this.cap.estado_categoria=parseInt(this.estado_categoria_seleccionado);
    console.log("El estado en editar 04 es: "+this.cap.estado_categoria);
    this.catalogoServiceCategorias.editCategoria(this.cap).then(resp => {
      this.categoria_verificada = resp;
      this.msgs.push({
        severity: 'success',
        summary: 'Success Message',
        detail: 'La categoria con nombre ' + this.categoria_verificada.nombre_categoria + ' se actualizó correctamente.'
      });
      this.dialog = false; // cerrar el diálogo después de actualizar la marca
      const div = this.document.getElementById('card');
      div?.scrollIntoView({ behavior: 'smooth' });
      this.showMessages = true;
      this.submitted = false;
      setTimeout(() => {
        this.ocultarMensajes();
      }, 7000);

      this.catalogoServiceCategorias.getAllCategorias()
      .then(response=>{
        console.log(response)
        this.lista_categorias=response;
      }).catch(error => {
        console.log("Error al obtener las categorias: " + error)
      });
    });/*,
    error => {
      console.error(error);
    }).catch(error => {
      console.log("Error al obtener el menú de usuarios: " + error);
    });*/
  }


  NewCategoriaDialog() {
    this.limpiar();
    this.tipo_transaccion="c";
    this.dialog = true;
    //this.mar = new Marcas();
    /*
    this.catalogoServiceMarcas.getAllMarcas().then(response=>{
      console.log(response);
      this.lista_marcas = response;
    }).catch(error => {
      console.log("Error al obtener las marcas: " + error)
    });
  */
    /*
    this.seguridadService.getAllUsuarios().then(res=>{
      this.listaUsuarios = res;
    }).catch(error => {
      console.log("Error al obtener el menú de usuarios: " + error)
    });

*/



  }



  confirmarEliminacionCategoria(categoria_proveedor:Categorias) {
    this.cap = categoria_proveedor;
    this.displayConfirmation = true;
  }

  eliminarCategoria() {
    this.catalogoServiceCategorias.deleteCategoria(this.cap.id_categoria).then(resp => {
      this.categoria_verificada = resp;
      this.msgs.push({
        severity: 'success',
        summary: 'Success Message',
        detail: 'La categoria con nombre ' + this.categoria_verificada.nombre_categoria + ' se eliminó correctamente.'
      });
      this.displayConfirmation = false;
      const div = this.document.getElementById('card');
      div?.scrollIntoView({ behavior: 'smooth' });
      this.showMessages = true;
      this.tableHeight;
      setTimeout(() => {
        this.ocultarMensajes();
      }, 7000);
      this.catalogoServiceCategorias.getAllCategorias()
      .then(response=>{
        console.log(response);
        this.lista_categorias=response;
      }).catch(error => {
        console.log("Error al obtener las categorias: " + error);
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
  }

  cancelarDialogo(){
    this.dialog = false;

    this.limpiar();
  }

  limpiar(){

    this.cap = new Categorias();
    this.tipo_transaccion='';
    this.estado_categoria_seleccionado="";
  }





}
