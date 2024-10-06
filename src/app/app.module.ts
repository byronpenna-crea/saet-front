import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PersonaComponent } from './component/seguridad/persona/persona.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SeguridadService } from './services/seguridad.service';
import { LoginComponent } from './component/login/login.component';
import { MenuComponent } from './component/menu/menu.component';
import { CommonModule, HashLocationStrategy } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorInterceptor } from './jwt-interceptor.interceptor';
import { LocationStrategy } from '@angular/common';
import { CategoriaComponent } from './component/catalogo/categoria/categoria.component';
import { SubCategoriaComponent } from './component/catalogo/sub-categoria/sub-categoria.component';
import { PlacaComponent } from './component/catalogo/placa/placa.component';
import { TabViewModule } from 'primeng/tabview';
import { HotkeyModule, HotkeyOptions } from 'angular2-hotkeys';
import { SplitterModule } from 'primeng/splitter';
import { InicioComponent } from './component/inicio/inicio.component';
import { CardModule } from 'primeng/card';
import { ReporteDocenteComponent } from './component/catalogo/reporte-docente/reporte-docente.component';
import { ReporteEstudianteComponent } from './component/catalogo/reporte-estudiante/reporte-estudiante.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChartModule } from 'primeng/chart';
import { ReporteDesarrolloAprendizajeComponent } from './component/catalogo/reporte-desarrollo-aprendizaje/reporte-desarrollo-aprendizaje.component';
import { ReporteActaResponsabilidadComponent } from './component/catalogo/reporte-acta-responsabilidad/reporte-acta-responsabilidad.component';
import { FileUploadModule } from 'primeng/fileupload';
import { AutenticaComponent } from './component/catalogo/autentica/autentica.component';
import { SaetComponent } from './component/catalogo/saet/saet.component';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { RichtextComponent } from './component/catalogo/saet/component/richtext/richtext.component';
import { StatusTableComponent } from './component/catalogo/saet/component/status-table/status-table.component';
import { TabsComponent } from './component/catalogo/saet/component/tabs/tabs.component';
import { TabItemComponent } from './component/catalogo/saet/component/tab-item/tab-item.component';
import { SaetButtonComponent } from './component/catalogo/saet/component/saet-button/saet-button.component';
import { BuscarEstudianteComponent } from './component/catalogo/saet/pages/buscar-estudiante/buscar-estudiante.component';
import { SaetInputComponent } from './component/catalogo/saet/component/saet-input/saet-input.component';
import { SaetTableComponent } from './component/catalogo/saet/component/saet-table/saet-table.component';

import { EstudianteDatosGeneralesComponent } from './component/catalogo/saet/pages/estudiante-datos-generales/estudiante-datos-generales.component';
import { SaetQuestionComponent } from './component/catalogo/saet/component/saet-question/saet-question.component';
import { EstudianteCaracterizacionComponent } from './component/catalogo/saet/pages/estudiante-caracterizacion/estudiante-caracterizacion.component';
import { EstudianteCaracterizacionIniciarComponent } from './component/catalogo/saet/pages/estudiante-caracterizacion-iniciar/estudiante-caracterizacion-iniciar.component';
import { SaetStudentNameHeaderComponent } from './component/catalogo/saet/component/saet-student-name-header/saet-student-name-header.component';
import { EstudianteEvaluacionesComponent } from './component/catalogo/saet/pages/estudiante-evaluaciones/estudiante-evaluaciones.component';
import { SaetGlobalHeaderComponent } from './component/catalogo/saet/component/saet-global-header/saet-global-header.component';
import { SaetMensajeUsuarioComponent } from './component/catalogo/saet/component/saet-mensaje-usuario/saet-mensaje-usuario.component';
import { SaetTabComponent } from './component/catalogo/saet/component/saet-tab/saet-tab.component';
import { SaetTabButtonsComponent } from './component/catalogo/saet/component/saet-tab-buttons/saet-tab-buttons.component';
import { EstudianteCuestionarioPsicologiaComponent } from './component/catalogo/saet/pages/estudiante-cuestionario-psicologia/estudiante-cuestionario-psicologia.component';
import { EstudianteCuestionarioPedagogiaComponent } from './component/catalogo/saet/pages/estudiante-cuestionario-pedagogia/estudiante-cuestionario-pedagogia.component';
import { EstudianteCuestionarioLenguajeComponent } from './component/catalogo/saet/pages/estudiante-cuestionario-lenguaje/estudiante-cuestionario-lenguaje.component';
import { EstudianteNoValidoComponent } from './component/catalogo/saet/pages/estudiante-no-valido/estudiante-no-valido.component';
import { EstudiantePdfComponent } from './component/catalogo/saet/pages/estudiante-pdf/estudiante-pdf.component';
import { EstudianteInformeTrimestralComponent } from './component/catalogo/saet/pages/estudiante-informe-trimestral/estudiante-informe-trimestral.component';
import { SaetUnderlinedTitleComponent } from './component/catalogo/saet/component/saet-underlined-title/saet-underlined-title.component';
import { CheckboxModule } from 'primeng/checkbox';
import { SaetRadioComponent } from './component/catalogo/saet/component/saet-radio/saet-radio.component';
import { SaetCheckboxComponent } from './component/catalogo/saet/component/saet-checkbox/saet-checkbox.component';
import { SaetTabAgendaComponent } from './component/catalogo/saet/component/saet-tab-agenda/saet-tab-agenda.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SaetConfirmComponent } from './component/catalogo/saet/component/saet-confirm/saet-confirm.component';
import { EstudiantePaeiComponent } from './component/catalogo/saet/pages/estudiante-paei/estudiante-paei.component';
import { SaetCuestionarioTablaComponent } from './component/catalogo/saet/component/saet-cuestionario-tabla/saet-cuestionario-tabla.component';
import { EstudianteDetallePaeiComponent } from './component/catalogo/saet/pages/estudiante-detalle-paei/estudiante-detalle-paei.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { EstudianteEvaluacionAgendaComponent } from './component/catalogo/saet/pages/estudiante-evaluacion-agenda/estudiante-evaluacion-agenda.component';
import { EstudianteGraficasComponent } from './component/catalogo/saet/pages/estudiante-graficas/estudiante-graficas.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SaetGraficaPastelComponent } from './component/catalogo/saet/component/saet-grafica-pastel/saet-grafica-pastel.component';
import { SaetGraficaBarrasComponent } from './component/catalogo/saet/component/saet-grafica-barras/saet-grafica-barras.component';
import { SaetGraficaLinearComponent } from './component/catalogo/saet/component/saet-grafica-linear/saet-grafica-linear.component';
import { EstudianteResetComponent } from './component/catalogo/saet/pages/estudiante-reset/estudiante-reset.component';
import { SaetAgendarEvaluacionComponent } from './component/catalogo/saet/component/saet-agendar-evaluacion/saet-agendar-evaluacion.component';
import { SaetQuestionTableComponent } from './component/catalogo/saet/component/saet-question-table/saet-question-table.component';
import { SaetTextAreaComponent } from './component/catalogo/saet/component/saet-text-area/saet-text-area.component';
import { EstudianteDaiCaracterizacionComponent } from './component/catalogo/saet/pages/estudiante-dai-caracterizacion/estudiante-dai-caracterizacion.component';
import { EstudianteDeiInformeCuantitativoComponent } from './component/catalogo/saet/pages/estudiante-dei-informe-cuantitativo/estudiante-dei-informe-cuantitativo.component';
import { EstudianteDeiInformeTrimestralComponent } from './component/catalogo/saet/pages/estudiante-dei-informe-trimestral/estudiante-dei-informe-trimestral.component';
import { EstudianteDeiInformeCualitativoComponent } from './component/catalogo/saet/pages/estudiante-dei-informe-cualitativo/estudiante-dei-informe-cualitativo.component';
import { SaetTarjetaInformeComponent } from './component/catalogo/saet/component/saet-tarjeta-informe/saet-tarjeta-informe.component';
import { SaetIndividualRadioComponent } from './component/catalogo/saet/component/saet-individual-radio/saet-individual-radio.component';
import { SaetLoadingComponent } from './component/catalogo/saet/component/saet-loading/saet-loading.component';
import { SaetFormTableComponent } from './component/catalogo/saet/component/saet-form-table/saet-form-table.component';
import { DaiEstudianteDatosGeneralesComponent } from './component/catalogo/saet/pages/dai-estudiante-datos-generales/dai-estudiante-datos-generales.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonaComponent,
    LoginComponent,
    MenuComponent,
    CategoriaComponent,
    SubCategoriaComponent,
    PlacaComponent,
    InicioComponent,
    SaetComponent,
    ReporteDocenteComponent,
    ReporteEstudianteComponent,
    ReporteDesarrolloAprendizajeComponent,
    ReporteActaResponsabilidadComponent,
    AutenticaComponent,
    RichtextComponent,
    StatusTableComponent,
    TabsComponent,
    TabItemComponent,
    SaetButtonComponent,
    BuscarEstudianteComponent,
    SaetInputComponent,
    SaetTableComponent,
    EstudianteDatosGeneralesComponent,
    SaetQuestionComponent,
    EstudianteCaracterizacionComponent,
    EstudianteCaracterizacionIniciarComponent,
    SaetStudentNameHeaderComponent,
    EstudianteEvaluacionesComponent,
    SaetGlobalHeaderComponent,
    SaetMensajeUsuarioComponent,
    SaetTabComponent,
    SaetTabButtonsComponent,
    EstudianteCuestionarioPsicologiaComponent,
    EstudianteCuestionarioPedagogiaComponent,
    EstudianteCuestionarioLenguajeComponent,
    EstudianteNoValidoComponent,
    EstudiantePdfComponent,
    EstudianteInformeTrimestralComponent,
    SaetUnderlinedTitleComponent,
    SaetRadioComponent,
    SaetCheckboxComponent,
    SaetTabAgendaComponent,
    SaetConfirmComponent,
    EstudiantePaeiComponent,
    SaetCuestionarioTablaComponent,
    EstudianteDetallePaeiComponent,
    EstudianteEvaluacionAgendaComponent,
    EstudianteGraficasComponent,
    SaetGraficaPastelComponent,
    SaetGraficaBarrasComponent,
    SaetGraficaLinearComponent,
    EstudianteResetComponent,
    SaetAgendarEvaluacionComponent,
    SaetQuestionTableComponent,
    SaetTextAreaComponent,
    EstudianteDaiCaracterizacionComponent,
    EstudianteDeiInformeCuantitativoComponent,
    EstudianteDeiInformeTrimestralComponent,
    EstudianteDeiInformeCualitativoComponent,
    SaetTarjetaInformeComponent,
    SaetIndividualRadioComponent,
    SaetLoadingComponent,
    SaetFormTableComponent,
    DaiEstudianteDatosGeneralesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatGridListModule,
    HttpClientModule,
    TableModule,
    EditorModule,
    PanelModule,
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    PanelMenuModule,
    ReactiveFormsModule,
    MessagesModule,
    MessageModule,
    DropdownModule,
    CalendarModule,
    RadioButtonModule,
    CommonModule,
    MatFormFieldModule,
    TabViewModule,
    HotkeyModule.forRoot(), // Utiliza la configuración predeterminada
    SplitterModule,
    CardModule,
    ProgressSpinnerModule,
    ChartModule,
    FileUploadModule,
    FieldsetModule,
    CheckboxModule,
    ConfirmDialogModule,
    NgxChartsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    SeguridadService,
    ConfirmationService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
