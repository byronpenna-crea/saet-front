import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeguridadUsuarioComponent } from './component/seguridad/seguridad.usuario.component';
import { PersonaComponent } from './component/seguridad/persona/persona.component';
import { LoginComponent } from './component/login/login.component';
import { UserGuardGuard } from './user-guard.guard';
import { MenuComponent } from './component/menu/menu.component';
import { CategoriaComponent } from './component/catalogo/categoria/categoria.component';
import { SubCategoriaComponent } from './component/catalogo/sub-categoria/sub-categoria.component';
import { PlacaComponent } from './component/catalogo/placa/placa.component';
import { InicioComponent } from './component/inicio/inicio.component';
import { SaetComponent } from './component/catalogo/saet/saet.component';
import { ReporteDocenteComponent } from './component/catalogo/reporte-docente/reporte-docente.component';
import { ReporteEstudianteComponent } from './component/catalogo/reporte-estudiante/reporte-estudiante.component';
import { ReporteDesarrolloAprendizajeComponent } from './component/catalogo/reporte-desarrollo-aprendizaje/reporte-desarrollo-aprendizaje.component';
import { ReporteActaResponsabilidadComponent } from './component/catalogo/reporte-acta-responsabilidad/reporte-acta-responsabilidad.component';
import { AutenticaComponent } from './component/catalogo/autentica/autentica.component';
import {BuscarEstudianteComponent} from "./component/catalogo/saet/pages/buscar-estudiante/buscar-estudiante.component";
import {EstudianteDatosGeneralesComponent} from "./component/catalogo/saet/pages/estudiante-datos-generales/estudiante-datos-generales.component";
import {EstudianteCaracterizacionComponent} from "./component/catalogo/saet/pages/estudiante-caracterizacion/estudiante-caracterizacion.component";
import {EstudianteCaracterizacionIniciarComponent} from "./component/catalogo/saet/pages/estudiante-caracterizacion-iniciar/estudiante-caracterizacion-iniciar.component";
import {EstudianteEvaluacionesComponent} from "./component/catalogo/saet/pages/estudiante-evaluaciones/estudiante-evaluaciones.component";
import {EstudianteCuestionarioLenguajeComponent} from "./component/catalogo/saet/pages/estudiante-cuestionario-lenguaje/estudiante-cuestionario-lenguaje.component";
import {EstudianteCuestionarioPsicologiaComponent} from "./component/catalogo/saet/pages/estudiante-cuestionario-psicologia/estudiante-cuestionario-psicologia.component";
import {EstudianteCuestionarioPedagogiaComponent} from "./component/catalogo/saet/pages/estudiante-cuestionario-pedagogia/estudiante-cuestionario-pedagogia.component";
import {EstudiantePdfComponent} from "./component/catalogo/saet/pages/estudiante-pdf/estudiante-pdf.component";
import {EstudianteInformeTrimestralComponent} from "./component/catalogo/saet/pages/estudiante-informe-trimestral/estudiante-informe-trimestral.component";
import {EstudiantePaeiComponent} from "./component/catalogo/saet/pages/estudiante-paei/estudiante-paei.component";
import {EstudianteDetallePaeiComponent} from "./component/catalogo/saet/pages/estudiante-detalle-paei/estudiante-detalle-paei.component";
/*
const routes: Routes = [



  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent, canActivate: [UserGuardGuard] },
  { path: 'empleados',
    component:SeguridadComponent,
    canActivate:[UserGuardGuard]},
   {path:'persona',component:PersonaComponent},





];
*/

const routes: Routes = [
  //{ path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {path: 'inicio', component: InicioComponent },
  { path: 'menu', component: MenuComponent, canActivate: [UserGuardGuard], children: [
      { path: 'empleados', component: SeguridadUsuarioComponent, canActivate: [UserGuardGuard] },
      { path: 'saet', component: SaetComponent },
      { path: 'saet-buscar', component: BuscarEstudianteComponent },
      { path: 'saet-buscar/:nie', component: BuscarEstudianteComponent },

      { path: 'saet-datos-estudiante/:nie', component: EstudianteDatosGeneralesComponent },
      { path: 'saet-caracterizacion-estudiante/:nie', component: EstudianteCaracterizacionComponent },


      { path: 'saet-pdf/:name', component: EstudiantePdfComponent },


      { path: 'saet-caracterizacion-iniciar/:nie', component: EstudianteCaracterizacionIniciarComponent },
      { path: 'saet-caracterizacion-iniciar/:nie/:mode', component: EstudianteCaracterizacionIniciarComponent },

      { path: 'saet-lenguaje-habla/:nie', component: EstudianteCuestionarioLenguajeComponent },
      { path: 'saet-lenguaje-habla/:nie/:mode', component: EstudianteCuestionarioLenguajeComponent },

      { path: 'saet-informe', component: EstudianteInformeTrimestralComponent },

      { path: 'saet-psicologia/:nie', component: EstudianteCuestionarioPsicologiaComponent },
      { path: 'saet-psicologia/:nie/:mode', component: EstudianteCuestionarioPsicologiaComponent },

      { path: 'saet-pedagogia/:nie', component: EstudianteCuestionarioPedagogiaComponent },
      { path: 'saet-pedagogia/:nie/:mode', component: EstudianteCuestionarioPedagogiaComponent },

      { path: 'saet-evaluaciones/:nie', component: EstudianteEvaluacionesComponent },
      { path: 'saet-paei/:nie', component: EstudiantePaeiComponent },
      { path: 'saet-paei-detalle/:nie', component: EstudianteDetallePaeiComponent },
      { path: 'persona', component: PersonaComponent, canActivate: [UserGuardGuard] },
      { path: 'categorias', component: CategoriaComponent, canActivate: [UserGuardGuard] },
      { path: 'sub_categorias', component: SubCategoriaComponent, canActivate: [UserGuardGuard] },
      { path: 'placas', component: PlacaComponent, canActivate: [UserGuardGuard] },
      { path: 'reporte_docente', component: ReporteDocenteComponent, canActivate: [UserGuardGuard]},
      { path: 'reporte_estudiante', component: ReporteEstudianteComponent, canActivate: [UserGuardGuard]},
      { path: 'reporte_desarrollo_aprendizaje', component: ReporteDesarrolloAprendizajeComponent, canActivate: [UserGuardGuard]},
      { path: 'acta_responsabilidad', component: ReporteActaResponsabilidadComponent, canActivate: [UserGuardGuard]},
      { path: 'autentica', component: AutenticaComponent, canActivate: [UserGuardGuard]},
  ] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
