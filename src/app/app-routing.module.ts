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
      { path: 'saet-datos-estudiante', component: EstudianteDatosGeneralesComponent },
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
