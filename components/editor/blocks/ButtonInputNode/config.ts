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
  name: 'Ввод кнопкой',
  icon: ButtonInputIcon,
  color: 'bg-brand-teal',
  component: ButtonInputNode,
  settingsComponent: ButtonInputSettings,
  initialData: {
    question: 'Пожалуйста, выберите вариант:',
    variableName: 'user_choice',
    buttons: [
        { id: `btn_${+new Date()}_1`, text: 'Вариант 1' },
        { id: `btn_${+new Date()}_2`, text: 'Вариант 2' },
    ]
  },
  validationSchema: z.object({
    question: z.string().min(1, 'Question cannot be empty'),
    variableName: z.string().min(1, 'Variable name cannot be empty'),
    buttons: z.array(z.object({})),
  }),
};