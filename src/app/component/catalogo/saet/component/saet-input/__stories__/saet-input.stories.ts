import {Meta, moduleMetadata, Story} from "@storybook/angular";
import {StorybookPrimeNgModule} from "../../../../../../storybook-config/storybook-prime-ng.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SaetInputComponent} from "../saet-input.component";
export default {
  title: 'saet-input',
  component: SaetInputComponent,
  decorators: [
    moduleMetadata({

      declarations: [SaetInputComponent],
      imports: [StorybookPrimeNgModule, BrowserAnimationsModule],
    }),
  ],
} as Meta;
const Template: Story<SaetInputComponent> = (args: SaetInputComponent) => ({
  component: SaetInputComponent,
  props: {
    ...args
  },
});
export const Primary = Template.bind({});
Primary.args = {

}
