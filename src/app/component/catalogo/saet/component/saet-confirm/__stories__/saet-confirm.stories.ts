import { SaetButtonComponent } from '../../saet-button/saet-button.component';
import { moduleMetadata, Story } from '@storybook/angular';
import { StorybookPrimeNgModule } from '../../../../../../storybook-config/storybook-prime-ng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaetConfirmComponent } from '../saet-confirm.component';
import { ConfirmDialog } from 'primeng/confirmdialog';

export default {
  title: 'saet-confirm',
  component: SaetConfirmComponent,
  decorators: [
    moduleMetadata({
      declarations: [SaetButtonComponent, ConfirmDialog],
      imports: [StorybookPrimeNgModule, BrowserAnimationsModule],
    }),
  ],
};

const Template: Story<SaetConfirmComponent> = (args: SaetConfirmComponent) => ({
  component: SaetConfirmComponent,
  props: {
    ...args,
  },
});
export const Primary = Template.bind({});
Primary.args = {
  title: 'Confirm ',
};
