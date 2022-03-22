import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToInicio = () => redirectLoggedInTo(['/inicio']);

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule),
    ...canActivate(redirectLoggedInToInicio)
  },
  {
    path: 'inicio', 
    loadChildren: () => import('./components/inicio/inicio.module').then(m => m.InicioModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: '**', pathMatch: 'full', redirectTo: 'login',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
