import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login-form.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guard/auth.guard';
import { HomeComponent } from './home/home.component';
import { Role } from './model/role.enum';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, },
  {
    path: 'admin', loadChildren: './modules/admin/admin.module#AdminModule',
    canActivate: [AuthGuard], canLoad: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  { path: 'register', component: RegisterComponent, },
  { path: '**', redirectTo: '' }
];

export const AppRouter = RouterModule.forRoot(appRoutes);
