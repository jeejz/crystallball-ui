import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHomeComponent } from './adminhome/adminhome.component';
import { AdminModuleRouter } from './admin.routing';

@NgModule({
  declarations: [AdminHomeComponent],
  imports: [
    CommonModule,
    AdminModuleRouter
  ]
})
export class AdminModule { }
