import {SaetButtonComponent} from "../../saet-button/saet-button.component";
import {SaetFormTableComponent} from "../saet-form-table.component";
import {moduleMetadata, Story} from "@storybook/angular";
import {StorybookPrimeNgModule} from "../../../../../../storybook-config/storybook-prime-ng.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export default {
  title: 'form-table',
  component: SaetFormTableComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookPrimeNgModule, BrowserAnimationsModule],
    }),
  ]
}
const Template: Story<SaetFormTableComponent> = (args: SaetFormTableComponent) => ({
  component: SaetFormTableComponent,
  props: {
    ...args,
  },
});

export const Primary = Template.bind({});
