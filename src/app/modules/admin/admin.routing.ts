import { Routes, RouterModule } from '@angular/router';
import { AdminHomeComponent } from './adminhome/adminhome.component';
import { AuthGuard } from 'src/app/guard/auth.guard';

const adminRoutes: Routes = [
  { path: '', component: AdminHomeComponent, canActivate: [AuthGuard] }
  ];

export const AdminModuleRouter = RouterModule.forChild(adminRoutes);
