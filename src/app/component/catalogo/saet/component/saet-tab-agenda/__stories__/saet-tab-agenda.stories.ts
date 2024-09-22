import {SaetAgendarEvaluacionComponent} from "../../saet-agendar-evaluacion/saet-agendar-evaluacion.component";
import {Meta, moduleMetadata, Story} from "@storybook/angular";
import {TabItemComponent} from "../../tab-item/tab-item.component";
import {SaetInputComponent} from "../../saet-input/saet-input.component";
import {SaetUnderlinedTitleComponent} from "../../saet-underlined-title/saet-underlined-title.component";
import {SaetButtonComponent} from "../../saet-button/saet-button.component";
import {SaetTabComponent} from "../../saet-tab/saet-tab.component";
import {StorybookPrimeNgModule} from "../../../../../../storybook-config/storybook-prime-ng.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TabViewModule} from "primeng/tabview";
import {FieldsetModule} from "primeng/fieldset";
import {SaetTabAgendaComponent} from "../saet-tab-agenda.component";

export default {
  title: 'agendar/01-Tab-agenda',
  component: SaetTabAgendaComponent,
  decorators: [
    moduleMetadata({
      declarations: [TabItemComponent, SaetInputComponent,SaetUnderlinedTitleComponent, SaetButtonComponent, SaetTabComponent, SaetAgendarEvaluacionComponent],
      imports: [
        StorybookPrimeNgModule, BrowserAnimationsModule, TabViewModule, FieldsetModule],
    }),
  ],
} as Meta;

const Template: Story<SaetTabAgendaComponent> = (args: SaetTabAgendaComponent) => ({
  component: SaetTabAgendaComponent,
  props: args,
});

export const Primary = Template.bind({});
