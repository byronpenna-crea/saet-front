import {Component, Inject} from '@angular/core';
import {BaseComponent} from "../../BaseComponent";
import {IMessageComponent, UserMessage} from "../../interfaces/message-component.interface";
import {userMessageInit} from "../../shared/messages.model";
import {DOCUMENT} from "@angular/common";
import {CatalogoServiceCor} from "../../../../../services/catalogo/catalogo.service.cor";
import {ActivatedRoute, Router} from "@angular/router";
import {ButtonStyle} from "../../component/saet-button/saet-button.component";
import {IconComponent} from "../../shared/component.config";
import {TableColumn} from "../../component/saet-table/saet-table.component";

interface estadoValidacionTableInterface {
  especialista: string;
  estado: string;
  verDetalle: string;
}
@Component({
  selector: 'app-estudiante-paei',
  templateUrl: './estudiante-paei.component.html',
  styleUrls: ['./estudiante-paei.component.css']
})
export class EstudiantePaeiComponent extends BaseComponent implements IMessageComponent{

  userMessage: UserMessage = userMessageInit;

  override async ngOnInit() {
    await super.ngOnInit();
  }
  buttonStyle = ButtonStyle;
  buttonIcon = IconComponent;
  constructor(
    @Inject(DOCUMENT) document: Document,
    catalogoServiceCOR: CatalogoServiceCor,
    route: ActivatedRoute,
    router: Router
  ){
    super(document, catalogoServiceCOR, route, router);
  }
  estadoValidacionColumns:TableColumn<estadoValidacionTableInterface>[] = [
    {key: "especialista", header: "Especialista"},
    {key: "estado", header: "Estado"},
    {key: "verDetalle", header: "Ver detalle"}
  ]
  rowData = [
    { col1: 'Especialista en Psicología', col2: 'No iniciado', col3: ''},
    { col1: 'Especialista en Pedagogía', col2: 'No iniciado', col3: ''},
    { col1: 'Especialista en Habla y lenguaje', col2: 'No iniciado', col3: ''},
    { col1: 'Coordinador(a) de COR', col2: 'No iniciado', col3: ''},
  ]
  async btnVerPaei() {
    await this.router.navigate(['/menu/saet-paei-detalle/',  this.nie ]);
  }
}
