import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditorModule} from "primeng/editor";
import {FormsModule} from "@angular/forms";
import {FieldsetModule} from "primeng/fieldset";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {ConfirmDialog} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";
import {TabViewModule} from "primeng/tabview";
import {TabMenuModule} from "primeng/tabmenu";
import {InputTextModule} from "primeng/inputtext";
import {CalendarModule} from "primeng/calendar";

@NgModule({
  imports: [
    CommonModule,
    EditorModule,
    FieldsetModule,
    TableModule,
    TabViewModule,
    TabMenuModule,
    ButtonModule,
    InputTextModule,
    CalendarModule
  ],
  exports: [
    EditorModule,
    FormsModule,
    FieldsetModule,
    ButtonModule,
    TableModule,
    TabViewModule,
    TabMenuModule,
    ButtonModule,
    InputTextModule,
    CalendarModule
  ],
  providers: [
    ConfirmDialog,
    ConfirmationService
  ]
})
export class StorybookPrimeNgModule {}
