import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { CrearClienteComponent } from "./crear-cliente/crear-cliente.component";
import { CrearUsuarioComponent } from "./crear-usuario/crear-usuario.component";
import { CrearEquipoComponent } from "./crear-equipo/crear-equipo.component";
import { AgendaComponent } from "./agenda/agenda.component";
import { ActualizarOrdenComponent } from "./actualizar-orden/actualizar-orden.component";
import { ParametrosComponent } from "./parametros/parametros.component";
import { Routes, RouterModule } from "@angular/router";
import { MenuComponent } from "./menu/menu.component";
import { AngularFireModule } from "@angular/fire";
import { environment } from "src/environments/environment";
import { AngularFireStorageModule } from "angularfire2/storage";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgBootstrapFormValidationModule } from "ng-bootstrap-form-validation";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { IcloudComponent } from "./icloud/icloud.component";
import { AgmCoreModule } from "@agm/core";
import { ListarClienteComponent } from "./listar-cliente/listar-cliente.component";
import { MapaComponent } from "./mapa/mapa.component";
import { ActualizarClienteComponent } from "./actualizar-cliente/actualizar-cliente.component";
import { FirebaseService } from "./services/firebase.service";
import { EditarClienteComponent } from "./editar-cliente/editar-cliente.component";
import { ListarUsuariosComponent } from "./listar-usuarios/listar-usuarios.component";
import { OrdenComponent } from "./orden/orden.component";
import { EstadoComponent } from "./estado/estado.component";
import { ListarEstadosComponent } from "./listar-estados/listar-estados.component";
import { TservicioComponent } from "./tservicio/tservicio.component";
import { ListarOrdenesComponent } from "./listar-ordenes/listar-ordenes.component";
import { FullCalendarModule } from "@fullcalendar/angular";
import { AgendaPrComponent } from "./agenda-pr/agenda-pr.component";
import { ListaTservicioComponent } from "./lista-tservicio/lista-tservicio.component";
import { ProgramacionComponent } from "./programacion/programacion.component";
import { UpdatesComponent } from "./updates/updates.component";
import { TriageComponent } from "./triage/triage.component";
import { AgendaxtecnicoComponent } from "./agendaxtecnico/agendaxtecnico.component";
import { AgendaxordenComponent } from "./agendaxorden/agendaxorden.component"; // for FullCalendar!;
import { HttpClientModule } from "@angular/common/http";

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "agenda", component: AgendaComponent },
  { path: "agenda-pr", component: AgendaPrComponent },
  { path: "actualizar-orden", component: ActualizarOrdenComponent },
  { path: "crear-cliente/:id", component: CrearClienteComponent },
  { path: "listar-cliente", component: ListarClienteComponent },
  { path: "crear-equipo", component: CrearEquipoComponent },
  { path: "crear-usuario/:id", component: CrearUsuarioComponent },
  { path: "parametros", component: ParametrosComponent },
  { path: "icloud", component: IcloudComponent },
  { path: "actualizar-cliente/:id", component: ActualizarClienteComponent },
  { path: "editar-cliente", component: EditarClienteComponent },
  { path: "listar-usuarios", component: ListarUsuariosComponent },
  { path: "crear-orden/:id", component: OrdenComponent },
  { path: "estados/:id", component: EstadoComponent },
  { path: "listado-estados", component: ListarEstadosComponent },
  { path: "tipo-servicio/:id", component: TservicioComponent },
  { path: "listar-ordenes", component: ListarOrdenesComponent },
  { path: "listar-tservicio", component: ListaTservicioComponent },
  { path: "programacion/:id", component: ProgramacionComponent },
  { path: "updates/:id", component: UpdatesComponent },
  { path: "triage", component: TriageComponent },
  { path: "agenda-tecnico", component: AgendaxtecnicoComponent },
  { path: "agenda-orden", component: AgendaxordenComponent },
  { path: "mapa", component: MapaComponent }
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
    MenuComponent,
    IcloudComponent,
    ListarClienteComponent,
    MapaComponent,
    ActualizarClienteComponent,
    EditarClienteComponent,
    ListarUsuariosComponent,
    OrdenComponent,
    EstadoComponent,
    ListarEstadosComponent,
    TservicioComponent,
    ListarOrdenesComponent,
    AgendaPrComponent,
    ListaTservicioComponent,
    ProgramacionComponent,
    UpdatesComponent,
    TriageComponent,
    AgendaxtecnicoComponent,
    AgendaxordenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Esencial para funcionamiento de [()]
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    CommonModule,
    NgBootstrapFormValidationModule.forRoot(),
    NgBootstrapFormValidationModule,
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAorrP1RL6rUh3NI1dEHYIxUUmhjaVWbfc"
    }),
    FullCalendarModule,
    HttpClientModule
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule {}
