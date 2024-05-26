import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {getIconClass, IconComponent} from "../../shared/component.config";


export enum ButtonStyle {
  WHITE,
  BLUE
}

export interface SaetButtonArgs {
  text: string;
  buttonStyle?: ButtonStyle;
  buttonIcon?: IconComponent | null;
}
@Component({
  selector: 'app-saet-button',
  templateUrl: './saet-button.component.html',
  styleUrls: ['./saet-button.component.css']
})

export class SaetButtonComponent implements OnChanges{
  /*@Input() text:string = "";
  @Input() buttonStyle?:ButtonStyle = ButtonStyle.WHITE;
  @Input() buttonIcon?:ButtonIcon | null = null;*/
  @Input() testId:string = "";
  @Input() buttonArgs: SaetButtonArgs = {
    buttonIcon: null,
    buttonStyle: ButtonStyle.WHITE,
    text: ""
  };
  @Output() onClick: EventEmitter<Event> = new EventEmitter<Event>();
  handleClick(event: Event): void {
    this.onClick.emit(event);
  }

  styleClasses: string = "";
  iconClass: string = "";

  ngOnChanges(changes: SimpleChanges) {
    if (changes['buttonArgs']) {
      const prevConfig = changes['buttonArgs'].previousValue as SaetButtonArgs;
      const currConfig = changes['buttonArgs'].currentValue as SaetButtonArgs;

      if (!prevConfig || prevConfig.buttonStyle !== currConfig.buttonStyle) {
        this.updateStyleClasses();
      }

      if (!prevConfig || prevConfig.buttonIcon !== currConfig.buttonIcon) {
        this.updateIconClass();
      }
    }
  }

  private updateStyleClasses() {
    switch (this.buttonArgs.buttonStyle) {
      case ButtonStyle.WHITE:
        this.styleClasses = "saet-button-white";
        break;
      case ButtonStyle.BLUE:
        this.styleClasses = "saet-button-blue";
        break;
    }
  }

  private updateIconClass() {
    this.iconClass = getIconClass(this.buttonArgs.buttonIcon ?? null);
  }
}
