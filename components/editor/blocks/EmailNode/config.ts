import { BlockConfig, ZodSchema } from '../../../../types';
import EmailNode from './EmailNode';
import EmailSettings from './EmailSettings';
import { EmailIcon } from '../../../icons/EmailIcon';

const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({ email: (_msg: string) => ({}) }) }),
};

export const emailBlockConfig: BlockConfig = {
  type: 'emailNode',
  name: 'Email уведомление',
  icon: EmailIcon,
  color: 'bg-slate-500',
  component: EmailNode,
  settingsComponent: EmailSettings,
  initialData: { 
    to: 'admin@example.com',
    subject: 'Новая заявка от {name}',
    body: 'Пользователь {name} ({email}) оставил заявку.'
  },
  validationSchema: z.object({
    to: z.string().min(1, 'Recipient cannot be empty').email("Invalid email address"),
    subject: z.string().min(1, 'Subject cannot be empty'),
    body: z.string(),
  }),
};
