import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Tarea, TareaService } from 'src/app/services/tarea.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  listForm!: FormGroup;
  spinner: boolean = false;
  tareas!: Observable<Tarea[]>;
  tareaInfo: any;
  tareaEdit: any;
  infoComponent: boolean = false;
  formAccion: boolean = false;
  usuario: any;

  constructor(private fb: FormBuilder, private tareaService: TareaService, private toast: ToastrService, private usuarioService: UsuarioService) {
    
    this.usuario = {
      uid: "",
      email: ""
    }

    this.usuarioService.obtenerUsuarioActual().subscribe(data => {
      this.usuario = data;
      if(this.usuario != null)
        this.tareas = this.tareaService.obtenerTareas(this.usuario.uid);
    })

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

      this.tareaService.agregarTarea(tarea, this.usuario.uid).then(() => {
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

    let tInfo = (data: any) => {
        this.tareaInfo = data;
        this.infoComponent = true;
        if(document.body.clientWidth < 992)
          this.scrollTo(150);
        else
          this.scrollTo(0);
        
        this.tareaInfo.index = i;
    }

    if(opcion && document.body.scrollTop == 0)
      this.tareaService.obtenerTareaCanal(id || "").subscribe(data => {
        tInfo(data);
      })
    else{
      this.tareaService.obtenerTarea(id || "").then(data => {
        if(opcion){
          tInfo(data);
        }
        else{
          this.tareaEdit = data;
          this.tareaEdit.index = i;
    
          this.listForm.patchValue({
            titulo: this.tareaEdit.titulo,
            contenido: this.tareaEdit.contenido,
            fecha: this.tareaEdit.fecha
          })
        }
      })
    }
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

    this.formAccion = this.tareaEdit.index === i ? false : true;

    if(this.formAccion){
      this.obtenerTarea(false, id, i);
      this.scrollTo(0);
    }
    else if(!this.formAccion){
      this.emptyActForm(i);
    }
  }

  emptyActForm(i?: number){
    this.tareaEdit = {};
    this.tareaEdit.index = "";
    this.listForm.reset();
    this.formAccion = false;
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
