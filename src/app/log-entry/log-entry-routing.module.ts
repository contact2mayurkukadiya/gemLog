import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogFormComponent } from './log-form/log-form.component';

const routes: Routes = [
  {
    path: 'add',
    component: LogFormComponent
  },
  {
    path: 'edit/:date',
    component: LogFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogEntryRoutingModule { }