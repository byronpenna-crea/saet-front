import { SaetButtonComponent } from '../../saet-button/saet-button.component';
import { moduleMetadata, Story } from '@storybook/angular';
import { StorybookPrimeNgModule } from '../../../../../../storybook-config/storybook-prime-ng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaetGlobalHeaderComponent } from '../saet-global-header.component';
import { SAET_MODULE } from '../../../shared/evaluaciones';
import { SaetStudentNameHeaderComponent } from '../../saet-student-name-header/saet-student-name-header.component';
import { SaetTabButtonsComponent } from '../../saet-tab-buttons/saet-tab-buttons.component';

export default {
  title: 'saet-global-header',
  component: SaetGlobalHeaderComponent,
  decorators: [
    moduleMetadata({
      declarations: [SaetStudentNameHeaderComponent, SaetTabButtonsComponent],
      imports: [StorybookPrimeNgModule, BrowserAnimationsModule],
    }),
  ],
  argTypes: {
    nie: {
      control: 'text',
    },
    module: {
      control: 'select',
      options: {
        Cor: SAET_MODULE.COR,
        Dai: SAET_MODULE.DAI,
      },
    },
  },
};
const Template: Story<SaetGlobalHeaderComponent> = (
  args: SaetGlobalHeaderComponent
) => ({
  component: SaetGlobalHeaderComponent,
  props: {
    ...args,
  },
});
export const Primary = Template.bind({});
export const Dai = Template.bind({});
export const Cor = Template.bind({});
Dai.args = {
  nie: '1234',
  nombreCompleto: 'Byron Aldair Pena Portillo',
  module: SAET_MODULE.DAI,
};
Cor.args = {
  nie: '4321',
  nombreCompleto: 'Michael Padilla',
  module: SAET_MODULE.COR,
};
