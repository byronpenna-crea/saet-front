import { SaetButtonComponent } from '../../saet-button/saet-button.component';
import { moduleMetadata, Story } from '@storybook/angular';
import { StorybookPrimeNgModule } from '../../../../../../storybook-config/storybook-prime-ng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaetLoadingComponent } from '../saet-loading.component';

export default {
  title: 'saet-loading',
  component: SaetLoadingComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookPrimeNgModule, BrowserAnimationsModule],
    }),
  ],
  argTypes: {
    message: {
      control: 'text',
    },
  },
};
const Template: Story<SaetLoadingComponent> = (args: SaetLoadingComponent) => ({
  component: SaetLoadingComponent,
  props: {
    ...args,
  },
});
export const Primary = Template.bind({});
Primary.args = {
  message: 'Cargando',
  isLoading: true,
};
