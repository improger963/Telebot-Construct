import { BlockConfig, ZodSchema } from '../../../../types';
import InlineKeyboardNode from './InlineKeyboardNode';
import InlineKeyboardSettings from './InlineKeyboardSettings';
import { InlineKeyboardIcon } from '../../../icons/InlineKeyboardIcon';

// Mock Zod for schema definition
const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({}) }),
  number: () => ({}),
  array: (_element: any) => ({}),
};

export const inlineKeyboardBlockConfig: BlockConfig = {
  type: 'inlineKeyboardNode',
  name: 'Инлайн-клавиатура',
  icon: InlineKeyboardIcon,
  color: 'bg-brand-cyan',
  component: InlineKeyboardNode,
  settingsComponent: InlineKeyboardSettings,
  initialData: {
    text: 'Пожалуйста, сделайте выбор.',
    buttons: [{ id: `btn_${+new Date()}`, text: 'Подробнее' }],
  },
  validationSchema: z.object({
    text: z.string().min(1, 'Message cannot be empty'),
    buttons: z.array(z.object({})),
    columns: z.number(),
  }),
};