import { BlockConfig, ZodSchema } from '../../../../types';
import ButtonInputNode from './ButtonInputNode';
import ButtonInputSettings from './ButtonInputSettings';
import { ButtonInputIcon } from '../../../icons/ButtonInputIcon';

// Mock Zod for schema definition
const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({}) }),
  array: (_element: any) => ({}),
};

export const buttonInputBlockConfig: BlockConfig = {
  type: 'buttonInputNode',
  name: 'Button Input',
  icon: ButtonInputIcon,
  color: 'bg-teal-500',
  component: ButtonInputNode,
  settingsComponent: ButtonInputSettings,
  initialData: {
    question: 'Please choose an option:',
    variableName: 'user_choice',
    buttons: [
        { id: `btn_${+new Date()}_1`, text: 'Option 1' },
        { id: `btn_${+new Date()}_2`, text: 'Option 2' },
    ]
  },
  validationSchema: z.object({
    question: z.string().min(1, 'Question cannot be empty'),
    variableName: z.string().min(1, 'Variable name cannot be empty'),
    buttons: z.array(z.object({})),
  }),
};