import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ManageCompanyComponent } from './components/company/manage-company/manage-company.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'sign-up', component: RegisterComponent },
  { path: 'companies', component: ManageCompanyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
