import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Import all the NG-ZORRO modules you are using
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCardModule } from 'ng-zorro-antd/card';
import { LayoutModule } from '@angular/cdk/layout';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
// We create a list of all the modules we want to share
const SHARED_MODULES = [
  CommonModule,
  ReactiveFormsModule,
  LayoutModule,
  // --- Add all the ZORRO modules here ---
  NzFormModule,
  NzInputModule,
  NzButtonModule,
  NzMessageModule,
  NzPageHeaderModule,
  NzSpinModule,
  NzInputNumberModule,
  NzIconModule,
  NzGridModule,
  NzLayoutModule,
  NzMenuModule,
  NzDrawerModule,
  NzCardModule,
  NzEmptyModule,
  NzTableModule,
  NzDatePickerModule
];

@NgModule({
  declarations: [],
  imports: [
    ...SHARED_MODULES
  ],
  // We must EXPORT the modules so that other modules that import this SharedModule can use them
  exports: [
    ...SHARED_MODULES
  ]
})
export class SharedModule { }