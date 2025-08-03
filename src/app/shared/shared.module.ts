import { importProvidersFrom, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Import all the NG-ZORRO modules you are using
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid'; // For nz-row and nz-col
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCardModule } from 'ng-zorro-antd/card'; // <-- For nz-card
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout'; // <-- CDK Imports


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