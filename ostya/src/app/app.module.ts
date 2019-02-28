import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CrearClienteComponent } from './crear-cliente/crear-cliente.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { CrearEquipoComponent } from './crear-equipo/crear-equipo.component';
import { AgendaComponent } from './agenda/agenda.component';
import { ActualizarOrdenComponent } from './actualizar-orden/actualizar-orden.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'agenda', component: AgendaComponent},
  {path: 'actualizar-orden', component: ActualizarOrdenComponent},
  {path: 'crear-cliente', component: CrearClienteComponent},
  {path: 'crear-equipo', component: CrearEquipoComponent},
  {path: 'crear-usuario', component: CrearUsuarioComponent},
  {path: 'parametros', component: ParametrosComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    CrearClienteComponent,
    CrearUsuarioComponent,
    CrearEquipoComponent,
    AgendaComponent,
    ActualizarOrdenComponent,
    ParametrosComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
