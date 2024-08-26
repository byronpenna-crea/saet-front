import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {ButtonStyle} from "../../component/saet-button/saet-button.component";
import {Direction} from "../../component/saet-grafica-barras/saet-grafica-barras.component";
import {Departamentos} from "../../../../../models/departamentos";
import {SeguridadService} from "../../../../../services/seguridad.service";
import {DOCUMENT} from "@angular/common";
import {ThemeService} from "../../../../../services/ThemeService";
import {CatalogoServiceDai} from "../../../../../services/catalogo/catalogo.service.dai";
import {CatalogoServiceDei} from "../../../../../services/catalogo/catalogo.service.dei";

import {Router} from "@angular/router";
import {DeiBaseComponent} from "../../DeiBaseComponent";
import {catalogoDepartamento, EnumDepartamentos} from "../../shared/dei";
import {linearMockData, LinearMockDataType} from "./mock/linear-data";

@Component({
  selector: 'app-estudiante-dei-informe-cuantitativo',
  templateUrl: './estudiante-dei-informe-cuantitativo.component.html',
  styleUrls: ['./estudiante-dei-informe-cuantitativo.component.css']
})


export class EstudianteDeiInformeCuantitativoComponent extends DeiBaseComponent implements OnInit{
  style = ButtonStyle;
  direction = Direction;

  linearGraphicData = linearMockData;
  filteredCasosAbordadosData = this.getFilteredData(this.linearGraphicData);
  getFilteredData(data:LinearMockDataType) {
    return Object.keys(data).map(departamentoKey => {
      const departamentoName = EnumDepartamentos[departamentoKey as keyof typeof EnumDepartamentos] as unknown as string;
      return {
        name: departamentoName,
        series: this.linearGraphicData[departamentoKey as unknown as EnumDepartamentos].map(item => ({
          name: item.name,
          value: item.value
        }))
      };
    });
  }
  getFilteredDataByDep(departamentoKey:keyof typeof EnumDepartamentos){

  }
  selectedGraphics = {
    alcance: undefined as EnumDepartamentos | undefined,
    casos: undefined as EnumDepartamentos | undefined,
    evaluaciones: undefined as EnumDepartamentos | undefined,
  };
  onGlobalDepartmentChange(event: { value: EnumDepartamentos }){
    const index: EnumDepartamentos =  event.value;
    this.selectedGraphics['alcance'] = index;
    this.selectedGraphics.casos = index;
    this.selectedGraphics.evaluaciones = index;
    this.onCasesChange({value: index});
    console.log('selected graphics ----', this.selectedGraphics)
  }
  onCasesChange(event: { value: EnumDepartamentos }) {
    const index: EnumDepartamentos =  event.value;
    console.log('index here --- ', index);
    //this.filteredCasosAbordadosData = this.linearGraphicData[index as EnumDepartamentos] || [];
    this.filteredCasosAbordadosData = [{
      name: EnumDepartamentos[index],
      series: this.linearGraphicData[index].map(item => ({
        name: item.name,
        value: item.value
      }))
    }];
    console.log('filteredCasosAbordados')
    this.selectedGraphics.casos = index;
  }

  cities: Departamentos[] = catalogoDepartamento;
  departamentos = catalogoDepartamento;
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
