import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { StorybookPrimeNgModule } from '../../../../../../storybook-config/storybook-prime-ng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaetTabButtonsComponent } from '../saet-tab-buttons.component';

export default {
  title: 'saet-tab-buttons',
  component: SaetTabButtonsComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookPrimeNgModule, BrowserAnimationsModule],
    }),
  ],
  /*,
  argTypes: {

  }*/
} as Meta;

const Template: Story<SaetTabButtonsComponent> = (
  args: SaetTabButtonsComponent
) => ({
  component: SaetTabButtonsComponent,
  props: {
    ...args,
  },
});

export const Primary = Template.bind({});
Primary.args = {
  tabs: [
    {
      text: 'Datos generales',
      href: '#',
      readOnly: false,
      testId: '',
      selected: false,
      onClick: () => {
        console.log('Datos generales click');
      },
    },
  ],
};
