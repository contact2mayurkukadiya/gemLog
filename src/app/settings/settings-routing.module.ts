import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PriceTiersComponent } from './price-tiers/price-tiers.component';

const routes: Routes = [
  {
    path: '',
    component: PriceTiersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }