import { BlockConfig, ZodSchema } from '../../../../types';
import PollNode from './PollNode';
import PollSettings from './PollSettings';
import { PollIcon } from '../../../icons/PollIcon';

const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({}) }),
  array: (_element: any) => ({ min: (_num: number, _msg: string) => ({ max: (_num: number, _msg: string) => ({}) }) }),
};

export const pollBlockConfig: BlockConfig = {
  type: 'pollNode',
  name: 'Опрос',
  icon: PollIcon,
  color: 'bg-brand-amber',
  component: PollNode,
  settingsComponent: PollSettings,
  initialData: { 
    question: 'Какой ваш любимый цвет?',
    options: [
        { id: `opt_${+new Date()}_1`, text: 'Красный' },
        { id: `opt_${+new Date()}_2`, text: 'Синий' },
    ]
  },
  validationSchema: z.object({
    question: z.string().min(1, 'Question cannot be empty'),
    options: z.array(z.object({})).min(2, "Poll must have at least 2 options").max(10, "Poll can have at most 10 options"),
  }),
};
