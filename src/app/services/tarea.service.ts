import { Injectable } from '@angular/core';
import { collection, addDoc, Firestore, collectionData, query, CollectionReference, updateDoc, doc, getDoc, docData, DocumentReference, deleteDoc } from '@angular/fire/firestore';
import { orderBy } from 'firebase/firestore';
import { Observable } from 'rxjs';

export interface Tarea {
  id?: string;
  titulo: string;
  contenido: string;
  fecha: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  private tarea!: Observable<Tarea>;

  constructor(private fire: Firestore) { }

  async agregarTarea(tarea: Tarea){
    let task = collection(this.fire, 'tarea');
    await addDoc(task, tarea);
  }

  obtenerTareas(): Observable<Tarea[]>{
    return collectionData<Tarea>(
      query<Tarea>(
        collection(this.fire, 'tarea') as CollectionReference<Tarea>, orderBy("fecha")
      ), {idField: 'id'}
    );
  }

  async actualizarTarea(datos: any, id: string){
    let task = doc(this.fire, 'tarea', id);

    await updateDoc(task, datos);
  }

  obtenerTarea(id: string): Observable<Tarea>{
    return docData<Tarea>(
      doc(this.fire, "tarea", id) as DocumentReference<Tarea>, {idField: 'id'}
    );

    /*let task = doc(this.fire, 'tarea', id);

    let docSnap = await getDoc(task);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return false;
    }*/
  }

  async eliminarTarea(id: string){
    let task = doc(this.fire, 'tarea', id);

    await deleteDoc(task);
  }
}
