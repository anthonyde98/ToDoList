import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Tarea, TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  listForm!: FormGroup;
  spinner: boolean = false;
  tareas: Observable<Tarea[]>;
  tareaInfo: any;
  tareaEdit: any;
  infoComponent: boolean = false;
  formAccion: boolean = false;

  constructor(private fb: FormBuilder, private tareaService: TareaService, private toast: ToastrService) {
    this.tareas = this.tareaService.obtenerTareas();

    this.listForm = this.fb.group({
      titulo: ["", [Validators.minLength(2), Validators.required]],
      contenido: ["", [Validators.minLength(3), Validators.required]],
      fecha: ["", [Validators.required]]
    })

    this.tareaInfo = this.tareaEdit = {
      titulo: "",
      contenido: "",
      fecha: "",
      index: ""
    }
   }

  ngOnInit(): void {
  }

  setTarea(){
    this.spinner = true;

    if(this.listForm.invalid){
      this.spinner = false;
      return
    }

    let tarea: Tarea = this.listForm.value;

    if(this.formAccion){

      this.actualizarTarea(true, this.listForm.value, this.tareaEdit.id)
    }
    else{
      tarea.estado = 'N';

      this.tareaService.agregarTarea(tarea).then(() => {
        this.toast.success("La tarea fue agregada con exito.", "Agregada");
      }).catch(error => {
        this.toast.error("Hubo un error al agregar la tarea.", "Error");
      }).finally(() => {
        this.listForm.reset();
        this.spinner = false;
      })
    }
  }

  obtenerTarea(opcion: boolean, id?: string, i?: number){
    this.tareaService.obtenerTarea(id || "").subscribe(data => {
      if(opcion){
        this.tareaInfo = data;
        this.infoComponent = true;
        if(document.body.clientWidth < 992)
          this.scrollTo(150);
        else
          this.scrollTo(0);
        
        this.tareaInfo.index = i;
        console.log(i)
      }
      else{
        this.tareaEdit = data;
        this.tareaEdit.index = i;
        console.log( this.tareaEdit.index)
        this.listForm.patchValue({
          titulo: this.tareaEdit.titulo,
          contenido: this.tareaEdit.contenido,
          fecha: this.tareaEdit.fecha
        })
      }
    }, 
      error => this.toast.error("Hubo un error al obtener la tarea.", "Error")
    )
  }

  actualizarTarea(opcion: boolean, dato?: any, id?: string){
    let datos;
    let mensaje = "";

    if(!opcion){
      datos = {
        estado: dato
      }
      mensaje = "cambiada a <span class=";
      if(dato == 'R')
        mensaje += "'text-success'>realizada</span>";
      else if(dato == 'P')
        mensaje += "'text-info'>en proceso</span>";
      else
        mensaje += "'text-danger'>no realizada</span>";
    }
    else{
      datos = this.listForm.value;
      mensaje = "<span class='text-warning'>editada</span>";
    }

    this.tareaService.actualizarTarea(datos, id || "").then(() => {
      this.toast.success(`La tarea fue ${mensaje} exitosamente.`, "Edición", {
        enableHtml: true
      });
    }).catch(error => {
      this.toast.error("Hubo un error al editar la tarea.", "Error");
    }).finally(() => {
      if(opcion){  
        this.spinner = false;
        setTimeout(() => {
          this.listForm.reset()
          this.formAccion = false;
        }, 500);
      }
    })
  }

  eliminarTarea(id?: string){
    this.tareaService.eliminarTarea(id || "").then(() => {
      this.toast.success("La tarea fue <span class='text-danger'>eliminada</span> con exito.",
       "Eliminación", {
        enableHtml: true
      });
    }).catch(error => {
      this.toast.error("Hubo un error al eliminar la tarea.", "Error");
      console.log(error)
    })
  }

  setActualizacionForm(id?: string, i?: number){

    this.formAccion = this.tareaEdit.index == i ? !this.formAccion : this.formAccion;

    if(this.formAccion){
      this.obtenerTarea(false, id, i);
      this.scrollTo(0);
    }
    else if(!this.formAccion){
      this.tareaEdit = {};
      this.tareaEdit.index = i;
      this.listForm.reset();
    }
  }

  setInfoComponent(id?: string, i?:number){
    if(this.infoComponent && this.tareaInfo.index == i){
      this.infoComponent = false;
      this.tareaInfo = undefined;
    }
    else{
      this.obtenerTarea(true, id, i);
    }
  }

  estiloInput(inputName: string): string{
    let resp = "";

    if(this.listForm.get(inputName)?.invalid && this.listForm.get(inputName)?.touched)
      resp ="red";
    else if(this.listForm.get(inputName)?.valid && this.listForm.get(inputName)?.touched) 
      resp = "green";
    else
      resp = "black";
    
    return resp;
  }

  scrollTo(to: number){
    document.body.scrollTop = to; // For Safari
    document.documentElement.scrollTop = to; // For Chrome, Firefox, IE and Opera
  }

}