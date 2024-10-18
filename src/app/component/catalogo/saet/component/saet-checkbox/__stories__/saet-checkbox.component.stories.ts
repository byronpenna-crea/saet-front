import { SaetButtonComponent } from '../../saet-button/saet-button.component';
import { moduleMetadata, Story } from '@storybook/angular';
import { StorybookPrimeNgModule } from '../../../../../../storybook-config/storybook-prime-ng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaetCheckboxComponent } from '../saet-checkbox.component';

export default {
  title: 'saet-checkbox',
  component: SaetCheckboxComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookPrimeNgModule, BrowserAnimationsModule],
    }),
  ],
};
const Template: Story<SaetCheckboxComponent> = (
  args: SaetCheckboxComponent
) => ({
  component: SaetCheckboxComponent,
  props: {
    ...args,
  },
});
export const Primary = Template.bind({});
