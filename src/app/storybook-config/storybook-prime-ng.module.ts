import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditorModule} from "primeng/editor";
import {FormsModule} from "@angular/forms";
import {FieldsetModule} from "primeng/fieldset";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";

@NgModule({
  imports: [
    CommonModule,
    EditorModule,
    FieldsetModule,
    TableModule
  ],
  exports: [
    EditorModule,
    FormsModule,
    FieldsetModule,
    ButtonModule,
    TableModule
  ],
  providers: []
})
export class StorybookPrimeNgModule {}
