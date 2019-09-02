import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "./authentication.service";
import { map } from "rxjs/operators";
import { FirebaseService } from "./firebase.service";

@Injectable({
  providedIn: "root"
})
export class AuthenticationGuard implements CanActivate {
  rutas: any;
  constructor(
    private authenticationServices: AuthenticationService,
    private router: Router,
    private firebaseService: FirebaseService
  ) {
    const appRoutes = [
      { path: "", rol: "all" },
      { path: "home", rol: "all" },
      { path: "login", rol: "all" },
      { path: "agenda", rol: "all" },
      { path: "agenda-pr", rol: "admin" },
      { path: "actualizar-orden", rol: "all" },
      { path: "crear-cliente/:id", rol: "admin" },
      { path: "listar-cliente", rol: "all" },
      { path: "crear-equipo", rol: "admin" },
      { path: "crear-usuario/:id", rol: "admin" },
      { path: "parametros", rol: "admin" },
      { path: "icloud", rol: "admin" },
      { path: "actualizar-cliente/:id", rol: "admin" },
      { path: "editar-cliente", rol: "admin" },
      { path: "listar-usuarios", rol: "admin" },
      { path: "crear-orden/:id", rol: "admin" },
      { path: "estados/:id", rol: "admin" },
      { path: "listado-estados", rol: "admin" },
      { path: "tipo-servicio/:id", rol: "admin" },
      { path: "listar-ordenes", rol: "all" },
      { path: "listar-tservicio", rol: "admin" },
      { path: "programacion/:id", rol: "admin" },
      { path: "updates/:id", rol: "all" },
      { path: "triage", rol: "all" },
      { path: "agenda-tecnico", rol: "all" },
      { path: "agenda-orden", rol: "all" },
      { path: "mapa", rol: "admin" },
      { path: "set-coordenadas/:id", rol: "all" }
    ];
    this.rutas = appRoutes;
  }
  userFirebase(uid) {
    this.firebaseService
      .getUserUid(uid)
      .valueChanges()
      .subscribe(usuario => {
        this.usuarioFire = usuario;
      });
  }
  permiso: boolean;
  usuarioFire: any;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authenticationServices.getStatus().pipe(
      map(status => {
        if (!status) {
          this.router.navigate(["/login"]);
          console.log("NO hay usuario");
        } else {
          this.userFirebase(status.uid);
          for (let i = 0; i < this.rutas.length; i++) {
            if (this.rutas[i].path == next.routeConfig.path) {
              console.log("Encontre la ruta : " + this.rutas[i].path);
              if (this.rutas[i].rol == "all") {
                console.log("Ruta con acceso para todos");
                return true;
              } else {
                if (this.usuarioFire.rol == "admin") {
                  console.log("Es un usuario Admin");
                  return true;
                } else {
                  console.log("Es un usuario restringido");
                  alert(
                    "No tiene permisos para entrar a: " + next.routeConfig.path
                  );
                  return false;
                }
              }
            }
          }
        }
      })
    );
  }
}
