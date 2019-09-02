import { Injectable } from "@angular/core";
import { from } from "rxjs";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabase } from "angularfire2/database";
import { CrearClienteComponent } from "../crear-cliente/crear-cliente.component";
import { createNodeAtIndex } from "@angular/core/src/render3/instructions";

@Injectable({
  providedIn: "root"
})
export class FirebaseService {
  /* --------------CLIENTES ---------------------*/
  //metodo de guardar cliente
  public guardarCliente(cliente) {
    this.afBD.database
      .ref("clientes/" + cliente.id)
      .set(cliente, function(error) {
        if (error) {
          console.log(error);
        } else {
        }
      });
  }
  //metodo obtener todos los clientes
  public getCliente() {
    return this.afBD.list("clientes/");
  }
  //metodo obtener un solo cliente
  public obtenerCliente(id) {
    return this.afBD.object("clientes/" + id);
  }
  /* --------------EQUIPOS ---------------------*/
  //metodo guardar equipo
  public guardarEquipo(equipo) {
    this.afBD.database
      .ref("equipos/" + equipo.cliente + "/" + equipo.tipo + "/" + equipo.id)
      .set(equipo, function(error) {
        if (error) {
          console.log(error);
        } else {
        }
      });
  }
  /* --------------CONSECUTIVOS ---------------------*/
  // metodo para actualizar consecutivo de documentos
  public setNext(consecutivo) {
    this.afBD.database
      .ref("next/" + consecutivo.doc)
      .set(consecutivo, function(error) {
        if (error) {
          console.log(error);
        } else {
        }
      });
  }
  //metodo para obterner consecutivo actual
  public getNext(doc) {
    return this.afBD.list("next/" + doc);
  }
  /* --------------USUARIOS ---------------------*/
  //metodo de guardar Usuario
  public guardarUsuario(usuario) {
    this.afBD.database
      .ref("usuarios/" + usuario.id)
      .update(usuario, function(error) {
        if (error) {
          console.log(error);
        } else {
        }
      });
  }
  //metodo obtener todos los usuarios
  public getUsuarios() {
    return this.afBD.list("usuarios/");
  }
  //metodo obtener un solo usuario
  public obtenerUsuario(id) {
    return this.afBD.object("usuarios/" + id);
  }
  //Obtener usuarios activos
  public getUusariosActivos() {
    return this.afBD.list("usuarios/", ref =>
      ref.orderByChild("activo").equalTo(true)
    );
  }
  public getUserUid(uid) {
    return this.afBD.list("usuarios/", ref =>
      ref.orderByChild("uid").equalTo(uid)
    );
  }
  /* --------------POR ID ---------------------*/
  // guarda por ID consecutivo. Se solicitan 2 parametros, el dato a guardar y el consecutivo actual.
  public guardarPorId(data, next) {
    // Se hace comparativo para saber si el dato es una actualizacion y se actualiza en el mismo ID.
    if (data.modificador == "act") {
      this.afBD.database
        .ref(data.doc + "/" + data.id)
        .set(data, function(error) {
          if (error) {
            console.log(error);
          } else {
          }
        });
      // y si es nuevo, primero: se incrementa el consecutivo y se cambia el id del dato a guardar.
    } else {
      let Incrementar = next[1] + 1;
      let newNext = {
        doc: data.doc,
        next: Incrementar
      };
      //Se guarda dato con el consecutivo incrementado.
      this.afBD.database
        .ref(data.doc + "/" + data.id)
        .set(data, function(error) {
          if (error) {
            console.log(error);
          } else {
          }
        });
      // Se actualiza el consecutivo, con el nuevo dato incrementado.
      this.setNext(newNext);
    }
  }

  //obtener todos por tipo de documento
  public getPorDoc(data) {
    return this.afBD.list(data.doc + "/");
  }
  public getEstadosCierre() {
    return this.afBD.list("estados/", ref =>
      ref.orderByChild("cerrada").equalTo(true)
    );
  }
  /* --------------ORDENES---------------------*/
  public getOrdenesAbiertas() {
    return this.afBD.list("orden/", ref =>
      ref.orderByChild("cerrada").equalTo(false)
    );
  }

  public getOrdenesEnTriage() {
    return this.afBD.list("orden/", ref =>
      ref.orderByChild("enTriage").equalTo(true)
    );
  }
  //metodo obtener un solo cliente
  public obtenerUnoId(data) {
    return this.afBD.object(data.doc + "/" + data.id);
  }
  public obtenerActualizaciones(data) {
    console.log(data);
    return this.afBD.list("orden/" + data.orden + "/updates/");
  }
  public guardarUpdates(data) {
    //armar fecha para indice log y data Log
    this.afBD.database
      .ref("orden/" + data.orden + "/updates/" + data.fecha)
      .set(data, function(error) {
        if (error) {
          console.log(error);
        } else {
        }
      });
  }
  public ActOrdenEstado(data) {
    console.log(data);
    this.afBD.database.ref("orden/" + data.id).update(data, function(error) {
      if (error) {
        console.log(error);
      } else {
      }
    });
  }
  /* --------------AGENDA---------------------*/
  public guardarAgenda(data) {
    this.afBD.database.ref("agenda/" + data.orden).set(data, function(error) {
      if (error) {
        console.log(error);
      } else {
      }
    });
  }
  public guardarAgendaHTecnico(data) {
    // Guarda la agenda definitiva para historico por tecnico
    this.afBD.database
      .ref("agendaHT/" + data.userId + "/" + data.endOk)
      .set(data, function(error) {
        if (error) {
          console.log(error);
        } else {
        }
      });
  }
  public guardarAgendaHOrden(data) {
    // Guarda la agenda definitiva para historico por orden
    this.afBD.database
      .ref("agendaHO/" + data.orden + "/" + data.endOk)
      .set(data, function(error) {
        if (error) {
          console.log(error);
        } else {
        }
      });
  }
  public guardarAgendaHfecha(data) {
    // Guarda la agenda definitiva para historico por orden
    this.afBD.database.ref("agendaHF/" + data.endOk).set(data, function(error) {
      if (error) {
        console.log(error);
      } else {
      }
    });
  }
  public EliminarAgenda(data) {
    // Guarda la agenda definitiva para historico por orden
    this.afBD.database.ref("agenda/" + data.orden).remove();
  }
  public guardarLogAgenda(data) {
    //armar fecha para indice log y data Log
    let fechahoy = Date.now();
    this.afBD.database
      .ref("agenda/" + data.orden + "/log/" + fechahoy)
      .set(data, function(error) {
        if (error) {
          console.log(error);
        } else {
        }
      });
  }

  public ActOrdenAgendada(data) {
    this.afBD.database.ref("orden/" + data.id).update(data, function(error) {
      if (error) {
        console.log(error);
      } else {
      }
    });
  }
  public getAgendaTecnico(data) {
    return this.afBD.list("agenda/", ref =>
      ref.orderByChild("tecnico").equalTo(data.tecnico)
    );
  }
  public getAllAgendas() {
    return this.afBD.list("agenda/");
  }
  public getAgendaHO(data) {
    return this.afBD.list("agendaHO/" + data.id);
  }
  public getAgendaHT(data) {
    return this.afBD.list("agendaHT/" + data.id);
  }
  public getAgendaHTxfecha(data) {
    return this.afBD.list("agendaHT/" + data.id, ref =>
      ref
        .orderByChild("endOk")
        .startAt(data.desdeM)
        .endAt(data.hastaM)
    );
  }
  public getAgendaHF(data) {
    return this.afBD.list("agendaHF/", ref =>
      ref
        .orderByChild("endOk")
        .startAt(data.desdeM)
        .endAt(data.hastaM)
    );
  }
  public getAgendaHTall() {
    return this.afBD.list("agendaHT/", ref => ref.orderByKey().limitToLast(10));
  }

  /* --------------ORDENAR---------------------*/
  public ordenanzaNombre(items) {
    // sort by name
    items.sort(function(a, b) {
      var nombreA = a.nombre.toUpperCase(); // ignore upper and lowercase
      var nombreB = b.nombre.toUpperCase(); // ignore upper and lowercase
      if (nombreA < nombreB) {
        return -1;
      }
      if (nombreA > nombreB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
  }
  public inicialesUsuarios(usuario) {
    let iniciales = "";
    let separador = " ", // un espacio en blanco
      arregloDeSubCadenas = usuario.nombre.split(separador); // SEPARA EL NOMBRE EN CADENAS INDIVIDUALES
    // IMPRIME LA PRIMERA LETRA DE CADA CADENA
    for (let i = 0; i < arregloDeSubCadenas.length; i++) {
      if (i <= 1) {
        iniciales += arregloDeSubCadenas[i].substring(0, 1);
      } else {
        return iniciales;
      }
    }
  }
  public setUbicacion(data) {
    this.afBD.database
      .ref("ubicacion/" + data.id)
      .update(data, function(error) {
        if (error) {
          console.log(error);
        } else {
        }
      });
  }

  constructor(private afBD: AngularFireDatabase) {}
}
