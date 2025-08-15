import { BlockConfig, ZodSchema } from '../../../../types';
import RandomMessageNode from './RandomMessageNode';
import RandomMessageSettings from './RandomMessageSettings';
import { ShuffleIcon } from '../../../icons/ShuffleIcon';

// Mock Zod for schema definition
const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  array: (_element: any) => ({ min: (_num: number, _msg: string) => ({}) }),
};

export const randomMessageBlockConfig: BlockConfig = {
  type: 'randomMessageNode',
  name: 'Случайное сообщение',
  icon: ShuffleIcon,
  color: 'bg-brand-rose',
  component: RandomMessageNode,
  settingsComponent: RandomMessageSettings,
  initialData: {
    messages: [
      { id: `msg_${+new Date()}_1`, text: 'Вариант ответа 1' },
      { id: `msg_${+new Date()}_2`, text: 'Вариант ответа 2' },
    ]
  },
  validationSchema: z.object({
    messages: z.array(z.object({})).min(1, "Должно быть хотя бы одно сообщение"),
  }),
};