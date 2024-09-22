import {RichtextComponent} from "../../richtext/richtext.component";
import {Meta, moduleMetadata, Story} from "@storybook/angular";
import {StorybookPrimeNgModule} from "../../../../../../storybook-config/storybook-prime-ng.module";
import {SaetAgendarEvaluacionComponent} from "../saet-agendar-evaluacion.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TabItemComponent} from "../../tab-item/tab-item.component";
import {SaetInputComponent} from "../../saet-input/saet-input.component";
import {SaetUnderlinedTitleComponent} from "../../saet-underlined-title/saet-underlined-title.component";
import {SaetButtonComponent} from "../../saet-button/saet-button.component";
import {SaetTabComponent} from "../../saet-tab/saet-tab.component";
import {TabViewModule} from "primeng/tabview";
import {FieldsetModule} from "primeng/fieldset";
export default {
  title: 'agendar/02-Agendar-evaluacion',
  component: SaetAgendarEvaluacionComponent,
  decorators: [
    moduleMetadata({
      declarations: [TabItemComponent, SaetInputComponent,SaetUnderlinedTitleComponent, SaetButtonComponent, SaetTabComponent],
      imports: [
        StorybookPrimeNgModule, BrowserAnimationsModule, TabViewModule, FieldsetModule],
    }),
  ],
} as Meta;

const Template: Story<SaetAgendarEvaluacionComponent> = (args: SaetAgendarEvaluacionComponent) => ({
  component: SaetAgendarEvaluacionComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  readOnly: false,
  especialistaResponsableAgendar: {
    dui: '05035096-8',
    nombreCompleto: 'Byron Aldair Pena Portillo'
  },
  especialistaResponsableEvaluacion: {
    dui: '02156478-8',
    nombreCompleto: 'Diana Lisbeth Alfaro Galdamez'
  }
}
