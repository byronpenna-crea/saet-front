import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    TableModule
  ],
  exports: [
    TableModule
  ]
})
export class StorybookPrimeNgModule {}
