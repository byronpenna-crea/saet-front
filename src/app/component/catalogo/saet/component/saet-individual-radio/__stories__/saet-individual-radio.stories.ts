import { SaetButtonComponent } from '../../saet-button/saet-button.component';
import { moduleMetadata, Story } from '@storybook/angular';
import { StorybookPrimeNgModule } from '../../../../../../storybook-config/storybook-prime-ng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaetIndividualRadioComponent } from '../saet-individual-radio.component';

export default {
  title: 'saet-individual-radio',
  component: SaetIndividualRadioComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookPrimeNgModule, BrowserAnimationsModule],
    }),
  ],
};
const Template: Story<SaetIndividualRadioComponent> = (
  args: SaetIndividualRadioComponent
) => ({
  component: SaetIndividualRadioComponent,
  props: {
    ...args,
  },
});

export const Primary = Template.bind({});
