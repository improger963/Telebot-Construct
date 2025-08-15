import { BlockConfig, ZodSchema } from '../../../../types';
import MessageNode from './MessageNode';
import MessageSettings from './MessageSettings';
import { MessageIcon } from '../../../icons/MessageIcon';

// Mock Zod for schema definition - in a real app, you'd import 'z'
const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({}) }),
};

export const messageBlockConfig: BlockConfig = {
  type: 'messageNode',
  name: 'Message',
  icon: MessageIcon,
  color: 'bg-brand-blue',
  component: MessageNode,
  settingsComponent: MessageSettings,
  initialData: { text: 'New message', buttons: [] },
  validationSchema: z.object({
    text: z.string().min(1, 'Message cannot be empty'),
  }),
};