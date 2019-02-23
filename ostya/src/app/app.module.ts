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
    ParametrosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
