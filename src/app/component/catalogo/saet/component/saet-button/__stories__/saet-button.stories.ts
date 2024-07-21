import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { StorybookPrimeNgModule } from '../../../../../../storybook-config/storybook-prime-ng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonStyle, SaetButtonComponent } from '../saet-button.component';
import { IconComponent } from '../../../shared/component.config';

export default {
  title: 'Button',
  component: SaetButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookPrimeNgModule, BrowserAnimationsModule],
    }),
  ],
  argTypes: {
    buttonStyle: {
      control: 'select',
      options: Object.keys(ButtonStyle).filter(key => isNaN(Number(key))),
    },
    buttonIcon: {
      control: 'select',
      options: Object.keys(IconComponent).filter(key => isNaN(Number(key))),
    },
    buttonArgs: {
      text: { control: 'text' },
      buttonStyle: {
        control: 'select',
        options: Object.keys(ButtonStyle).filter(key => isNaN(Number(key))),
      },
      buttonIcon: {
        control: 'select',
        options: Object.keys(IconComponent).filter(key => isNaN(Number(key))),
      },
    },
  },
} as Meta<SaetButtonComponent>;

const Template: Story<SaetButtonComponent> = (args: SaetButtonComponent) => ({
  component: SaetButtonComponent,
  props: {
    ...args,
  },
});
export const Primary = Template.bind({});
export const White = Template.bind({});
White.args = {
  buttonArgs: {
    text: 'Button text',
    buttonStyle: ButtonStyle.WHITE,
  },
};
export const WhiteWithIcon = Template.bind({});
WhiteWithIcon.args = {
  buttonArgs: {
    text: 'Ver evento',
    buttonStyle: ButtonStyle.WHITE,
    buttonIcon: IconComponent.EYE,
  },
};
export const Blue = Template.bind({});
Blue.args = {
  buttonArgs: {
    text: 'Buscar estudiante',
    buttonStyle: ButtonStyle.BLUE,
  },
};
export const BlueWithIcon = Template.bind({});
BlueWithIcon.args = {
  buttonArgs: {
    text: 'Aprobar',
    buttonStyle: ButtonStyle.BLUE,
    buttonIcon: IconComponent.CHECK,
  },
};

export const BlueIcon = Template.bind({});
BlueIcon.args = {
  buttonArgs: {
    text: '',
    buttonStyle: ButtonStyle.BLUE,
    buttonIcon: IconComponent.CHECK,
  },
};
