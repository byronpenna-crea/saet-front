import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditorModule} from "primeng/editor";
import {FormsModule} from "@angular/forms";
import {FieldsetModule} from "primeng/fieldset";

@NgModule({
  imports: [
    CommonModule,
    EditorModule,
    FieldsetModule
  ],
  exports: [
    EditorModule,
    FormsModule,
    FieldsetModule,
  ],
  providers: []
})
export class StorybookPrimeNgModule {}
