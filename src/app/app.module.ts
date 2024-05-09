import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import { HttpClientModule} from '@angular/common/http';
import { TableModule } from 'primeng/table';
import {PanelModule} from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from "primeng/button";
import { SplitButtonModule } from "primeng/splitbutton"
import {DialogModule} from 'primeng/dialog'
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {PanelMenuModule} from 'primeng/panelmenu';
import { PersonaComponent } from './component/seguridad/persona/persona.component';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
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
import {SplitterModule} from 'primeng/splitter';
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
import {SaetComponent} from "./component/catalogo/saet/saet.component";
import {EditorModule} from 'primeng/editor';
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
    SaetQuestionComponent

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
    FieldsetModule
  ],
  providers: [
    SeguridadService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
