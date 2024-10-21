import { Inject, Injectable } from '@angular/core';
import { CatalogoServiceDei } from '../../../services/catalogo/catalogo.service.dei';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from '../../../services/ThemeService';
import { Router } from '@angular/router';
import { StudentDetail } from '../../../services/catalogo/catalogo.service.cor';
import { UserMessage } from './interfaces/message-component.interface';
import { userMessageInit } from './shared/messages.model';
import { ButtonStyle } from './component/saet-button/saet-button.component';

@Injectable()
export class DeiBaseComponent {
  nie = '';
  studentInfo?: StudentDetail;
  userMessage: UserMessage = userMessageInit;
  btnStyle = ButtonStyle;
  pageLoading = false;

  constructor(protected router: Router) {}
  redirectTo(url: string) {
    this.router.navigate([url]);
  }
}
