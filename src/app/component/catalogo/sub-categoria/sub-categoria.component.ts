import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { CatalogoServiceSubCategorias } from 'src/app/services/catalogo/catalogo.service.sub_categorias';
import { CatalogoServiceCategorias } from 'src/app/services/catalogo/catalogo.service.categorias';
import { Message } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
import { Personas } from 'src/app/models/personas';
import { Categorias } from 'src/app/models/categorias';
import { Sub_categorias } from 'src/app/models/sub_categorias';

@Component({
  selector: 'app-sub-categoria',
  templateUrl: './sub-categoria.component.html',
  styleUrls: ['./sub-categoria.component.css']
})
export class SubCategoriaComponent {


  @ViewChild('myTable') myTable!: ElementRef;
  lista_categorias: Categorias[] = [];
  lista_sub_categorias: Sub_categorias[] = [];
  sub_cat!:Sub_categorias;
  dialog!: boolean;
  submitted!: boolean;
  categoriaSeleccionado: number=0;
  showMessages = false;
  showMessages_dialog = false;
  sub_categoria_verificado!: Sub_categorias;
  msgs: Message[] = [];
  msgs_dialog: Message[] = [];
  persona_registro_para_enviar!: Personas;
  categoria_para_enviar!:Categorias;
  displayConfirmation = false;
  tipo_transaccion: string ='';
  estado_sub_categoria_seleccionado: string ='';
  lista_estados_sub_categoria: any[] = [
    { label: 'Seleccione un estado', value: '0' },
    { label: 'Activo', value: '1' },
    { label: 'Inactivo', value: '2' }
  ];



  constructor(private catalogoServiceCategorias: CatalogoServiceCategorias,
    @Inject(DOCUMENT) private document: Document,
    private catalogoServiceSubCategorias: CatalogoServiceSubCategorias) {
    this.sub_cat = new Sub_categorias();
    this.persona_registro_para_enviar = new Personas();
    this.categoria_para_enviar= new Categorias();

  }

  ngOnInit(): void {

    this.catalogoServiceSubCategorias.getAllSubCategorias()
      .then(response => {
        console.log(response)
        this.lista_sub_categorias = response;
      }).catch(error => {
        console.log("Error al obtener los modelos: " + error)
      });
    this.catalogoServiceCategorias.getAllCategorias()
      .then(response => {
        console.log(response)
        this.lista_categorias = response;
      }).catch(error => {
        console.log("Error al obtener las marcas: " + error)
      });

  }


  saveSubCategoria(sub_categoria: Sub_categorias): void {
    this.sub_cat=sub_categoria;
    this.submitted = true;
    // Obtener DUI del usuario registrado
    const dui = localStorage.getItem('dui') || '';
    this.persona_registro_para_enviar.dui_persona = dui;
    this.sub_cat.dui_usuario_registra_sub_categoria = this.persona_registro_para_enviar;

    // Validar nombre del modelo
    if (!this.sub_cat.nombre_sub_categoria) {
      this.msgs_dialog.push({ severity: 'error', summary: 'Error Message', detail: 'Por favor ingrese un nombre de la sub categoria.' });
      this.showMessages_dialog = true;
      return;
    }

    // Validar marca del modelo
    if (!this.categoriaSeleccionado) {
      this.msgs_dialog.push({ severity: 'error', summary: 'Error Message', detail: 'Por favor seleccione una marca.' });
      this.showMessages_dialog = true;
      return;
    }
    this.categoria_para_enviar.id_categoria=this.categoriaSeleccionado;
    this.sub_cat.id_categoria= this.categoria_para_enviar;
    this.sub_cat.estado_sub_categoria=parseInt(this.estado_sub_categoria_seleccionado);
    // Llamar al servicio para guardar el modelo
    this.catalogoServiceSubCategorias.saveSubCategoria(this.sub_cat).then(resp => {
      // Agregar el modelo creado a la lista
      this.sub_categoria_verificado=resp;
      // Mostrar mensaje de éxito y cerrar el diálogo
      this.msgs.push(
        { severity: 'success', summary: 'Success Message', detail: 'El modelo con nombre: '+this.sub_categoria_verificado.nombre_sub_categoria+'se registro correctamente' });
      this.dialog = false; // cerrar el diálogo después de actualizar el modelo
      const div=this.document.getElementById('card');
      div?.scrollIntoView({behavior:'smooth'});
      this.showMessages = true;
      this.tableHeight;
      this.submitted = false;
      setTimeout(()=>{
        this.ocultarMensajes();
      },7000);

      // Limpiar el objeto de persona responsable para el próximo uso
    this.persona_registro_para_enviar = new Personas();
    this.catalogoServiceSubCategorias.getAllSubCategorias()
  .then(response=>{
    console.log(response)
    this.lista_sub_categorias=response;
    //this.tableHeight;
  }).catch(error => {
    console.log("Error al obtener los modelos: " + error)
  });

  });

}


  leerSubCategorias(sub_categorias: Sub_categorias) {
    this.limpiar();

    this.tipo_transaccion="r";
    this.sub_cat = sub_categorias;
    this.dialog = true;
    this.estado_sub_categoria_seleccionado=this.sub_cat.estado_sub_categoria.toString();
    this.categoriaSeleccionado=this.sub_cat.id_categoria.id_categoria;

  }



  editModelo(sub_categoria: Sub_categorias): void {
    this.sub_cat=sub_categoria;
    this.submitted = true;
    this.categoria_para_enviar.id_categoria=this.categoriaSeleccionado;
    this.sub_cat.id_categoria=this.categoria_para_enviar;
    this.sub_cat.estado_sub_categoria=parseInt(this.estado_sub_categoria_seleccionado);
    this.catalogoServiceSubCategorias.editSubCategoria(this.sub_cat).then(resp => {
      this.sub_categoria_verificado = resp;
      this.msgs.push({
        severity: 'success',
        summary: 'Success Message',
        detail: 'La sub categoria con nombre ' + this.sub_categoria_verificado.nombre_sub_categoria + ' se actualizó correctamente.'
      });
      this.dialog = false; // cerrar el diálogo después de actualizar el modelo
      const div = this.document.getElementById('card');
      div?.scrollIntoView({ behavior: 'smooth' });
      this.showMessages = true;
      this.submitted = false;
      setTimeout(() => {
        this.ocultarMensajes();
      }, 7000);

      this.catalogoServiceSubCategorias.getAllSubCategorias()
      .then(response=>{
        console.log(response)
        this.lista_sub_categorias=response;
      }).catch(error => {
        console.log("Error al obtener los modelos: " + error)
      });
    });
}


NewModeloDialog() {
  this.limpiar();
  this.tipo_transaccion="c";
  this.dialog= true;
  this.catalogoServiceCategorias.getAllCategorias()
      .then(response => {
        console.log(response)
        this.lista_categorias = response;
      }).catch(error => {
        console.log("Error al obtener las marcas: " + error)
      });


}

confirmarEliminacionSubCategoria(sub_categoria: Sub_categorias) {
  this.sub_cat=sub_categoria;
  this.displayConfirmation = true;
}

eliminarSubCategoria() {

  this.catalogoServiceSubCategorias.deleteSubCategoria(this.sub_cat.id_sub_categoria).then(resp => {
    this.sub_categoria_verificado = resp;
    this.msgs.push({
      severity: 'success',
      summary: 'Success Message',
      detail: 'El modelo con nombre ' + this.sub_categoria_verificado.nombre_sub_categoria + ' se elimino correctamente.'
    });
    this.displayConfirmation = false; // cerrar el diálogo después de actualizar el modelo
    const div = this.document.getElementById('card');
    div?.scrollIntoView({ behavior: 'smooth' });
    this.showMessages = true;
    this.tableHeight;
    setTimeout(() => {

      this.ocultarMensajes();

    }, 7000);

    this.catalogoServiceSubCategorias.getAllSubCategorias()
    .then(response=>{
      console.log(response)
      this.lista_sub_categorias=response;
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

    this.categoriaSeleccionado= 0;
    this.sub_cat = new Sub_categorias();
    this.tipo_transaccion='';
    this.estado_sub_categoria_seleccionado="";
  }


}
