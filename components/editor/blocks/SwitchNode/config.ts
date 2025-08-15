import { BlockConfig, ZodSchema } from '../../../../types';
import SwitchNode from './SwitchNode';
import SwitchSettings from './SwitchSettings';
import { SwitchIcon } from '../../../icons/SwitchIcon';

// Mock Zod for schema definition
const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({}) }),
  array: (_element: any) => ({}),
};

export const switchBlockConfig: BlockConfig = {
  type: 'switchNode',
  name: 'Переключатель',
  icon: SwitchIcon,
  color: 'bg-brand-violet',
  component: SwitchNode,
  settingsComponent: SwitchSettings,
  initialData: {
    variable: 'userInput',
    cases: [
        { id: `case_${+new Date()}_1`, value: 'Вариант 1' },
        { id: `case_${+new Date()}_2`, value: 'Вариант 2' },
    ]
  },
  validationSchema: z.object({
    variable: z.string().min(1, 'Variable name cannot be empty'),
    cases: z.array(z.object({})),
  }),
};