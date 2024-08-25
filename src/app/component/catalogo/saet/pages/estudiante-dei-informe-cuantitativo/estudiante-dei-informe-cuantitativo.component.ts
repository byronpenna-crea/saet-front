import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {ButtonStyle} from "../../component/saet-button/saet-button.component";
import {Direction} from "../../component/saet-grafica-barras/saet-grafica-barras.component";
import {Departamentos} from "../../../../../models/departamentos";
import {SeguridadService} from "../../../../../services/seguridad.service";
import {DOCUMENT} from "@angular/common";
import {ThemeService} from "../../../../../services/ThemeService";
import {CatalogoServiceDai} from "../../../../../services/catalogo/catalogo.service.dai";
import {CatalogoServiceDei} from "../../../../../services/catalogo/catalogo.service.dei";
import {catalogoDepartamento, EnumDepartamentos, linearMockData} from "./mock/linear-data";
import {Router} from "@angular/router";
import {DeiBaseComponent} from "../../DeiBaseComponent";

@Component({
  selector: 'app-estudiante-dei-informe-cuantitativo',
  templateUrl: './estudiante-dei-informe-cuantitativo.component.html',
  styleUrls: ['./estudiante-dei-informe-cuantitativo.component.css']
})


export class EstudianteDeiInformeCuantitativoComponent extends DeiBaseComponent implements OnInit{
  style = ButtonStyle;
  direction = Direction;

  linearGraphicData = linearMockData;
  filteredCasosAbordadosData = this.linearGraphicData[EnumDepartamentos.SANTA_ANA];

  onDepartmentChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const index: number =  parseInt(target.value) ;
    this.filteredCasosAbordadosData = this.linearGraphicData[index as EnumDepartamentos] || [];
  }

  departamentos: Departamentos[] = catalogoDepartamento;
  constructor(
    private deiService:CatalogoServiceDei,
    @Inject(DOCUMENT) private document: Document,
    private themeService:ThemeService,
    router: Router
  ){
    super(router);
  }
  ngOnInit(): void {
    this.deiService.getAllDepartamentos().
    then(res=>{
      console.log('res ', res);
      //this.departamentos=res;
    }).catch(error => {
      console.log("Error al obtener departamentos: " + error)
    });
  }
  protected readonly EnumDepartamentos = EnumDepartamentos;
}
