import {SaetButtonComponent} from "../../saet-button/saet-button.component";
import {SaetFormTableComponent} from "../saet-form-table.component";
import {moduleMetadata, Story} from "@storybook/angular";
import {StorybookPrimeNgModule} from "../../../../../../storybook-config/storybook-prime-ng.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SaetInputComponent} from "../../saet-input/saet-input.component";
import {TabItemComponent} from "../../tab-item/tab-item.component";
import {SaetUnderlinedTitleComponent} from "../../saet-underlined-title/saet-underlined-title.component";
import {SaetTableComponent} from "../../saet-table/saet-table.component";

export default {
  title: 'form-table',
  component: SaetFormTableComponent,
  decorators: [

    moduleMetadata({

      declarations: [TabItemComponent,SaetUnderlinedTitleComponent,SaetInputComponent,SaetTableComponent, SaetButtonComponent],
      imports: [StorybookPrimeNgModule, BrowserAnimationsModule],
    }),
  ]
}
const Template: Story<SaetFormTableComponent> = (args: SaetFormTableComponent) => ({
  component: SaetFormTableComponent,
  props: {
    ...args,
  },
  template: `
    <div style="width: 50%; margin: 0 auto;">
      <app-saet-form-table [data]="data" />
    </div>
  `,
});

export const Primary = Template.bind({

});
export const WidthPreviousData = Template.bind({});
WidthPreviousData.args={
  data: [
    {
      id: '1',
      nombreCompleto: 'Byron Aldair Pena Portillo',
      parentesco: 'Padre',
      nivelEducativo: 'Universidad',
      ocupacion: 'Ingeniero',
      action: ''
    }
  ]
}
