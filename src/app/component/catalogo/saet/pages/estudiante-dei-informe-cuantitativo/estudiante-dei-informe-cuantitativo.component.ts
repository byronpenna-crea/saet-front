import { Component, ElementRef, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { ButtonStyle } from '../../component/saet-button/saet-button.component';
import { Direction } from '../../component/saet-grafica-barras/saet-grafica-barras.component';
import { Departamentos } from '../../../../../models/departamentos';
import { SeguridadService } from '../../../../../services/seguridad.service';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from '../../../../../services/ThemeService';
import { CatalogoServiceDai } from '../../../../../services/catalogo/catalogo.service.dai';
import {
  CatalogoServiceDei, PaeiGrafica,
  Schools,
} from '../../../../../services/catalogo/catalogo.service.dei';

import { ActivatedRoute, Router } from '@angular/router';
import { DeiBaseComponent } from '../../DeiBaseComponent';
import {
  catalgoZona,
  catalogoDepartamento,
  catalogoSexo,
  EnumDepartamentos,
  Sexo,
  Zona,
} from '../../shared/dei';
import { linearMockData, LinearMockDataType } from './mock/linear-data';
import { IconComponent } from '../../shared/component.config';

@Component({
  selector: 'app-estudiante-dei-informe-cuantitativo',
  templateUrl: './estudiante-dei-informe-cuantitativo.component.html',
  styleUrls: ['./estudiante-dei-informe-cuantitativo.component.css'],
})
export class EstudianteDeiInformeCuantitativoComponent
  extends DeiBaseComponent
  implements OnInit
{
  style = ButtonStyle;
  direction = Direction;
  linearGraphicData = linearMockData;
  filteredCasosAbordadosData = this.getFilteredData(this.linearGraphicData);

  @ViewChild('bottomAnchor') override bottomAnchor!: ElementRef<HTMLDivElement>;
  @ViewChild('topAnchor') override topAnchor!: ElementRef<HTMLDivElement>;

  estadoPaeiSeleccionado = '';
  startDate:Date| null = null;
  endDate:Date| null = null;
  formatDate(event:Date){
    const day = String(event.getDate()).padStart(2, '0');
    const month = String(event.getMonth() + 1).padStart(2, '0');
    const year = event.getFullYear();
    return `${year}-${month}-${day}`;
  }
  async onStartDateChange(event:Date){
    this.startDate = event;

    if(this.startDate != null && this.endDate != null){
      await this.refreshGraphics();
    }
  }
  async onEndDateChange(event:Date){
    this.endDate = event;
    if(this.startDate != null && this.endDate != null){
      await this.refreshGraphics();
    }
  }
  getFilteredData(data: LinearMockDataType) {
    return Object.keys(data).map(departamentoKey => {
      const departamentoName = EnumDepartamentos[
        departamentoKey as keyof typeof EnumDepartamentos
      ] as unknown as string;
      return {
        name: departamentoName,
        series: this.linearGraphicData[
          departamentoKey as unknown as EnumDepartamentos
        ].map(item => ({
          name: item.name,
          value: item.value,
        })),
      };
    });
  }
  getFilteredDataByDep(departamentoKey: keyof typeof EnumDepartamentos) {}
  paeiData: { name: string, value: number }[] = [];
  async onEstadoPAEIChange(estado: number) {
    try {
      this.estadoPaeiSeleccionado = estado.toString();

      const data = await this.deiService.getPAEIByEstado({
        fechaFin: null,
        codigosDepartamentoRegion: null,
        fechaInicio: null,
        estadoSocializado: 1,
        estadoProceso: 2,
        estadoFinalizado: 3
      });
      console.log('estado paei ---> ', data);
      this.paeiData = data.resultados.map((item: PaeiGrafica) => ({
        name: item.departamento,
        value: item.total,
      }));
    } catch (e) {
      console.error('Error al cargar datos PAEI', e);
      this.paeiData = [];
    }
  }
  selectedGraphics = {
    alcance: undefined as EnumDepartamentos | undefined,
    casos: undefined as EnumDepartamentos | undefined,
    evaluaciones: undefined as EnumDepartamentos | undefined,
  };
  onGlobalDepartmentChange(event: { value: EnumDepartamentos }) {
    const index: EnumDepartamentos = event.value;
    this.selectedGraphics['alcance'] = index;
    this.selectedGraphics.casos = index;
    this.selectedGraphics.evaluaciones = index;
    this.onCasesChange({ value: index });
    console.log('selected graphics ----', this.selectedGraphics);
  }
  onCasesChange(event: { value: EnumDepartamentos }) {
    const index: EnumDepartamentos = event.value;
    console.log('index here --- ', index);
    //this.filteredCasosAbordadosData = this.linearGraphicData[index as EnumDepartamentos] || [];
    this.filteredCasosAbordadosData = [
      {
        name: EnumDepartamentos[index],
        series: this.linearGraphicData[index].map(item => ({
          name: item.name,
          value: item.value,
        })),
      },
    ];
    console.log('filteredCasosAbordados');
    this.selectedGraphics.casos = index;
  }

  cities: Departamentos[] = catalogoDepartamento;
  sexs: Sexo[] = catalogoSexo;
  zones: Zona[] = catalgoZona;
  schools: Schools[] = [];
  dificultadesGrafica: {
    name: string,
    value: number
  }[] = [];
  departamentos = catalogoDepartamento;
  corCount = 0;
  daiCount = 0;
  async refreshGraphics() {
    let startDate:string | null = null;
    let endDate:string | null = null;

    if(this.startDate != null && this.endDate != null){
      startDate = this.formatDate(this.startDate);
      endDate = this.formatDate(this.endDate);
    }

    this.deiService.getPAEIByEstado({
      fechaFin: endDate,
      fechaInicio: startDate,
      codigosDepartamentoRegion: null,
      estadoSocializado: 1,
      estadoProceso: 2,
      estadoFinalizado: 3
    }).then((data) => {
      console.log('estado paei ---> ', data);
      this.paeiData = data.resultados.map((item: PaeiGrafica) => ({
        name: item.departamento,
        value: item.total,
      }));
    });
  }
  constructor(
    private deiService: CatalogoServiceDei,
    @Inject(DOCUMENT) private document: Document,
    private themeService: ThemeService,
    private route: ActivatedRoute,
    router: Router
  ) {
    super(router);
    this.pageLoading = true;
    this.route.paramMap.subscribe(params => {
      const nie = params.get('nie');
      if (nie) {
        this.nie = nie;
        //this.toggleTable();
      }
    });

    deiService.getAllSchools().then(x => {
      this.schools = x;
      console.log('schools here', this.schools);
    });
    deiService.getCorCount().then(x => {
      this.corCount = x;
    });
    deiService.getDaiCount().then(x => {
      this.daiCount = x;
    });
    this.refreshGraphics().then();
    deiService.getGraficaDificultad().then(data => {
      console.log('data is --> ', data);
      this.dificultadesGrafica = data.resultados.map((dificultad) => {
        return {
          name: dificultad.dificultad,
          value: dificultad.total
        }
      });
      console.log(this.dificultadesGrafica);
    });
    this.pageLoading = false;
  }

  ngOnInit(): void {
    this.deiService
      .getAllDepartamentos()
      .then(res => {
        console.log('res ', res);
        //this.departamentos=res;
      })
      .catch(error => {
        console.log('Error al obtener departamentos: ' + error);
      });
  }
  onTabChange(event: any) {
    const index = event.index;
    console.log('index ', index);
    if (index === 0) {
      this.redirectTo('menu/dei/informe-cualitativo');
    }
    if (index === 2) {
      this.redirectTo('menu/dei/informe-trimestral');
    }
  }
  protected readonly EnumDepartamentos = EnumDepartamentos;
  protected readonly IconCompoment = IconComponent;
  protected readonly ButtonStyle = ButtonStyle;
}
