import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ComunicationService {
  // ----------rol usuario logueado ------------
  private userLogeed = new BehaviorSubject<{}>({});
  public getUserLogeed = this.userLogeed.asObservable();
  public userLogeedChange(user: {}): void {
    this.userLogeed.next(user);
  }
  // -----------Todos los usuarios------------
  private allUsers = new BehaviorSubject<[]>([]);
  public getAllUser = this.allUsers.asObservable();
  public allUserChange(users: []): void {
    this.allUsers.next(users);
  }
  // -----------Todos los estados------------
  private allStates = new BehaviorSubject<[]>([]);
  public getAllStates = this.allStates.asObservable();
  public allStatesChange(states: []): void {
    this.allStates.next(states);
  }
  // ------------Todos los clientes -----------
  private allClients = new BehaviorSubject<[]>([]);
  public getAllClients = this.allClients.asObservable();
  public allClientsChange(clients: []): void {
    this.allClients.next(clients);
  }
  // ---------------Todas las Agendas------------
  private allAgendas = new BehaviorSubject<[]>([]);
  public getAllAgendas = this.allAgendas.asObservable();
  public allAgendasChange(clients: []): void {
    this.allAgendas.next(clients);
  }
}
