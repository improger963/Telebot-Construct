import { BlockConfig, ZodSchema } from '../../../../types';
import SubscriptionNode from './SubscriptionNode';
import SubscriptionSettings from './SubscriptionSettings';
import { SubscriptionIcon } from '../../../icons/SubscriptionIcon';

const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({}) }),
};

export const subscriptionBlockConfig: BlockConfig = {
  type: 'subscriptionNode',
  name: 'Подписка',
  icon: SubscriptionIcon,
  color: 'bg-brand-green',
  component: SubscriptionNode,
  settingsComponent: SubscriptionSettings,
  initialData: { 
    planName: 'Pro',
    price: '999',
    period: 'месяц'
  },
  validationSchema: z.object({
    planName: z.string().min(1, 'Plan name is required'),
    price: z.string().min(1, 'Price is required'),
    period: z.string().min(1, 'Period is required'),
  }),
};
