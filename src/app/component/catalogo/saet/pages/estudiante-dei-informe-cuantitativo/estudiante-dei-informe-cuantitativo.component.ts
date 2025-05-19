import { Component, ElementRef, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { ButtonStyle } from '../../component/saet-button/saet-button.component';
import { Direction } from '../../component/saet-grafica-barras/saet-grafica-barras.component';
import { Departamentos } from '../../../../../models/departamentos';
import { SeguridadService } from '../../../../../services/seguridad.service';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from '../../../../../services/ThemeService';
import { CatalogoServiceDai } from '../../../../../services/catalogo/catalogo.service.dai';
import {
  CatalogoServiceDei, IDepartamentoResultado, PaeiGrafica,
  Schools,
} from '../../../../../services/catalogo/catalogo.service.dei';

import { ActivatedRoute, Router } from '@angular/router';
import { DeiBaseComponent } from '../../DeiBaseComponent';
import {
  catalgoZona,
  catalogoDepartamento,
  catalogoSexo,
  EnumDepartamentos, IPeriodSearch,  ISexo,
  Zona,
} from '../../shared/dei';
import { linearMockData, LinearMockDataType } from './mock/linear-data';
import { IconComponent } from '../../shared/component.config';
import { Multi, Series } from '../../component/saet-grafica-linear/saet-grafica-linear.component';
interface iFrontEndGrafica {
  name: string, value: number
}
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
  // filteredCasosAbordadosData = this.getFilteredData(this.linearGraphicData);
  filteredCasosAbordadosData:Multi[] = [];
  @ViewChild('bottomAnchor') override bottomAnchor!: ElementRef<HTMLDivElement>;
  @ViewChild('topAnchor') override topAnchor!: ElementRef<HTMLDivElement>;

  estadoPaeiSeleccionado = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedSex: number | null = null;
  selectedSed: number | null = null;
  selectedState: string[] | null = null;
  selectedStateEvaluados: string[] | null = null;
  selectedPeriodType = 1; // by year
  formatDate(event: Date) {
    const day = String(event.getDate()).padStart(2, '0');
    const month = String(event.getMonth() + 1).padStart(2, '0');
    const year = event.getFullYear();
    return `${year}-${month}-${day}`;
  }
  async onStartDateChange(event: Date) {
    this.startDate = event;

    if (this.startDate != null && this.endDate != null) {
      await this.refreshGraphics();
    }
  }
  async onEndDateChange(event: Date) {
    console.log('end date', event);
    this.endDate = event;
    if (this.startDate != null && this.endDate != null) {
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
  paeiData: { name: string; value: number }[] = [];
  psicopedagogicoData: { name: string; value: number }[] = [];
  async onEstadoPAEIChange(estado: number) {
    try {
      this.estadoPaeiSeleccionado = estado.toString();

      const data = await this.deiService.getPAEIByEstado({
        fechaFin: null,
        codigosDepartamentoRegion: null,
        fechaInicio: null,
        codigoSexo: this.selectedSex,
        estadoSocializado: estado === 1 ? 1 : 0,
        estadoProceso: 2,
        estadoFinalizado: 3,
        codigoCentroEducativo: this.selectedSed,
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
  async onCentroEducativoChange(event: { value: number }) {
    if(event.value !== this.selectedSed){
      this.selectedSed = event.value;
      await this.refreshGraphics();
    }
  }
  async onSexChange(event: { value: number }) {
    if (event.value !== this.selectedSex) {
      this.selectedSex = event.value;
      await this.refreshGraphics();
    }
  }
  async onPeriodChange(event: { value: string }){
    let selectedPeriodType = 1;
    try {
      selectedPeriodType = parseInt(event.value);
    }catch (e){
      console.log('Error casting', e);
    }

    if( (selectedPeriodType !== this.selectedPeriodType )) {
      this.selectedPeriodType = selectedPeriodType;

      await this.refreshGraphics();
    }
  }
  async onEvaluadosDepartmentChange(event: { value: string }) {
    console.log('------- event --------', event);
    if(this.selectedStateEvaluados === null || (this.selectedStateEvaluados && event.value !== this.selectedStateEvaluados[0] )) {
      this.selectedStateEvaluados = event.value === null ? event.value : [event.value];
      console.log('------- selectedStateEvaluados --------', this.selectedStateEvaluados);
      await this.refreshGraphics();
    }
  }
  async onGlobalDepartmentChange(event: { value: string }) {
    if(this.selectedState === null || (this.selectedState && event.value !== this.selectedState[0] )){
      console.log('event value', event.value);
      this.selectedState = event.value === null ? event.value : [event.value];
      this.selectedStateEvaluados = this.selectedState;
      await this.refreshGraphics();
      console.log('selected graphics ----', this.selectedGraphics);
    }
  }
  // onCasesChange(event: { value: EnumDepartamentos }) {
  //   const index: EnumDepartamentos = event.value;
  //   console.log('index here --- ', index);
  //   //this.filteredCasosAbordadosData = this.linearGraphicData[index as EnumDepartamentos] || [];
  //   this.filteredCasosAbordadosData = [
  //     {
  //       name: EnumDepartamentos[index],
  //       series: this.linearGraphicData[index].map(item => ({
  //         name: item.name,
  //         value: item.value,
  //       })),
  //     },
  //   ];
  //   console.log('filteredCasosAbordados');
  //   this.selectedGraphics.casos = index;
  // }

  cities: Departamentos[] = catalogoDepartamento;
  periodSearch: IPeriodSearch[] = [
    {
      code: 1,
      name: 'Año'
    },
    {
      code: 2,
      name: 'Trimestre'
    },
    {

      code: 3,
      name: 'Mes'
    }
  ]
  sexs: ISexo[] = catalogoSexo;
  zones: Zona[] = catalgoZona;
  schools: Schools[] = [];
  dificultadesGrafica: {
    name: string;
    value: number;
  }[] = [];
  departamentos:IDepartamentoResultado[] = [];
  corCount = 0;
  daiCount = 0;
  async refreshGraphics() {
    let startDate: string | null = null;
    let endDate: string | null = null;

    if (this.startDate != null && this.endDate != null) {
      startDate = this.formatDate(this.startDate);
      endDate = this.formatDate(this.endDate);
    }
    this.deiService.getEstudiantesEvaluados({
      fechaFin: endDate,
      fechaInicio: startDate,
      estadoAgendado: 1,
      estadoProceso: 2,
      estadoFinalizado: 3,
      codigosDepartamentoRegion: this.selectedStateEvaluados,
      tipoPeriodo: this.selectedPeriodType
    }).then(data => {
      console.log('evaluados ---> ', data);
      console.log()
      const series:Series[] = data.resultados.map((resultado) => {
        return {
          name: resultado.periodo,
          value: resultado.total
        } as Series
      });
      console.log('series --> ', series);
      let name = '';
      switch (this.selectedPeriodType){
        case 1:
          name = 'Año';
          break;
        case 2:
          name = 'Trimestre';
          break;
        case 3:
          name = 'Mes';
          break;
      }
      this.filteredCasosAbordadosData = [{
        name: name,
        series: series,
      }] as Multi[];
      //   [{
      //   name: 'NAME 1',
      //   series: [
      //     {name: "x", value: 5},
      //     {name: "y", value: 5}
      //   ]
      // }]
      // this.paeiData = data.resultados.map((item) => ({
      //   name: item.departamento,
      //   value: item.total,
      // }));
    });
    this.deiService
      .getPAEIByEstado({
        fechaFin: endDate,
        fechaInicio: startDate,
        codigoSexo: this.selectedSex,
        codigosDepartamentoRegion: this.selectedState,
        estadoSocializado: 1,
        estadoProceso: 2,
        estadoFinalizado: 3,
        codigoCentroEducativo: this.selectedSed,

      })
      .then(data => {
        console.log('estado paei ---> ', data);
        this.paeiData = data.resultados.map((item: PaeiGrafica) => ({
          name: item.departamento,
          value: item.total,
        }));
      });

    this.deiService
      .getPsicoPedagogica({
        fechaFin: endDate,
        fechaInicio: startDate,
        codigosDepartamentoRegion: null,
        estadoAgendado: 1,
        estadoProceso: 2,
        estadoFinalizado: 3,
        codigoCentroEducativo: this.selectedSed,
        codigoSexo: this.selectedSex
      })
      .then(data => {
        console.log('psicopedagogico ----', data);
        this.psicopedagogicoData = data.resultados.map(psicopedagogico => {
          return {
            name: psicopedagogico.departamento,
            value: psicopedagogico.total,
          } as iFrontEndGrafica;
        });
      });
    this.deiService
      .getGraficaDificultad({
        fechaFin: endDate,
        fechaInicio: startDate,
        codigosDepartamentoRegion: null,
      })
      .then(data => {
        console.log('data is --> ', data);
        this.dificultadesGrafica = data.resultados.map(dificultad => {
          return {
            name: dificultad.dificultad,
            value: dificultad.total,
          };
        });
        console.log(this.dificultadesGrafica);
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
    this.configurationLoad().then();
    this.refreshGraphics().then();
    this.pageLoading = false;
  }
  async configurationLoad(){
    this.deiService.getSexo().then(x => {
      this.sexs = [
        {
          codigo: null,
          nombre: 'Todos',
        },
        ...x.map(sexo => {
          return {
            nombre: sexo.nombre,
            codigo: sexo.codigo,
          } as ISexo;
        }),
      ];
    });
    this.deiService.getDepartamentos().then(x => {
      this.departamentos = [
        {codigo: null, nombre: 'Todos',nombreBusqueda: 'Todos', habilitado: true,id: 1},
        ...x
      ]
    });
    this.deiService.getAllSchools().then(schools => {
      this.schools = [
        {
          sed_pk: null,
          sed_nombre: 'Todos',
          sed_codigo: null,
          sed_correo_electronico: '',
        },
        ...schools,
      ];
      console.log('schools here', this.schools);
    });
    this.deiService.getCorCount().then(x => {
      this.corCount = x;
    });
    this.deiService.getDaiCount().then(x => {
      this.daiCount = x;
    });
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
