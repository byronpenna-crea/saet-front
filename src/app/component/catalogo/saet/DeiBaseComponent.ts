import { ElementRef, Inject, Injectable, ViewChild } from '@angular/core';
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

  @ViewChild('bottomAnchor') bottomAnchor!: ElementRef<HTMLDivElement>;
  @ViewChild('topAnchor') topAnchor!: ElementRef<HTMLDivElement>;

  scrollToTop(): void {
    if (this.topAnchor) {
      this.topAnchor.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  scrollToBottom(): void {
    console.log('---------- bottom ',this.bottomAnchor);
    if (this.bottomAnchor) {
      this.bottomAnchor.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  constructor(protected router: Router) {}
  redirectTo(url: string) {
    this.router.navigate([url]);
  }
}
