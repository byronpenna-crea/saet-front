import {SaetButtonComponent} from "../../saet-button/saet-button.component";
import {moduleMetadata, Story} from "@storybook/angular";
import {StorybookPrimeNgModule} from "../../../../../../storybook-config/storybook-prime-ng.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SaetGlobalHeaderComponent} from "../saet-global-header.component";

export default {
  title: 'saet-global-header',
  component: SaetGlobalHeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookPrimeNgModule, BrowserAnimationsModule],
    }),
  ],
  argTypes: {
    nie: {
      control: 'text'
    }
  }
}
const Template: Story<SaetGlobalHeaderComponent> = (args: SaetGlobalHeaderComponent) => ({
  component: SaetGlobalHeaderComponent,
  props: {
    ...args,
  },
});
export const Primary = Template.bind({});
