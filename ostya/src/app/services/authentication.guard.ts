import { Injectable, OnInit } from "@angular/core";
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
export class AuthenticationGuard implements CanActivate, OnInit {
  rutas: any;
  userFire: any;
  statusFire: any;
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
      { path: "mapa", rol: "all" },
      { path: "set-coordenadas/:id", rol: "all" },
      { path: "cola-tecnico", rol: "all" }
    ];
    this.rutas = appRoutes;
  }
  getUsers() {
    return new Promise<boolean>((resolve, reject) => {
      this.firebaseService
        .getUusariosActivos()
        .valueChanges()
        .subscribe(user => {
          this.userFire = user;
          resolve(true);
        });
    });
  }
  getStatus() {
    return new Promise<boolean>((resolve, reject) => {
      this.authenticationServices
        .getStatus()
        .pipe(
          map(status => {
            this.statusFire = status;
            resolve(true);
          })
        )
        .subscribe();
    });
  }
  usuarioFire: any;
  rol: string;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let path = next.routeConfig.path;
    return this.getUsers().then(users => {
      return this.getStatus()
        .then(st => {
          return st;
        })
        .then(st => {
          let rol: any;
          let permiso: boolean;
          this.userFire.forEach(user => {
            if (user.uid == this.statusFire.uid) {
              rol = user.rol;
            }
          });
          if (!this.statusFire) {
            this.router.navigate(["/login"]);
          } else {
            this.rutas.forEach(ruta => {
              // debugger;
              if (ruta.path == path) {
                if (ruta.rol == "all") {
                  permiso = true;
                } else {
                  if (ruta.rol == rol) {
                    permiso = true;
                  } else {
                    permiso = false;
                  }
                }
              }
            });
          }
          return permiso;
        })
        .then(permiso => {
          if (permiso) {
            return true;
          } else {
            alert("No tiene permiso para entrar a: " + next.routeConfig.path);
            return false;
          }
        });

      // return st
    });

    // });
  }
  ngOnInit() {}

  //     let usuario;
  //     for (let i = 0; i < this.usuarioFire.length; i++) {
  //       if (this.usuarioFire[i].uid == status.uid) {
  //         usuario = this.usuarioFire[i].rol;
  //       }
  //     }
  //     console.log(usuario);
  //     if (!status) {
  //       this.router.navigate(["/login"]);
  //       console.log("NO hay usuario");
  //     } else {
  //       for (let i = 0; i < this.rutas.length; i++) {
  //         if (this.rutas[i].path == next.routeConfig.path) {
  //           console.log("Encontre la ruta : " + this.rutas[i].path);
  //           if (this.rutas[i].rol == "all") {
  //             console.log("Ruta con acceso para todos");
  //             return true;
  //           } else {
  //             if (usuario == "admin") {
  //               console.log("Es un usuario Admin");
  //               return true;
  //             } else {
  //               console.log("Es un usuario restringido");
  //               alert(
  //                 "No tiene permisos para entrar a: " + next.routeConfig.path
  //               );
  //               return false;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   })
  // );
}
