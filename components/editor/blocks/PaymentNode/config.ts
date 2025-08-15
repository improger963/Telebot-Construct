import { BlockConfig, ZodSchema } from '../../../../types';
import PaymentNode from './PaymentNode';
import PaymentSettings from './PaymentSettings';
import { PaymentIcon } from '../../../icons/PaymentIcon';

const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({}) }),
};

export const paymentBlockConfig: BlockConfig = {
  type: 'paymentNode',
  name: 'Платёж',
  icon: PaymentIcon,
  color: 'bg-brand-green',
  component: PaymentNode,
  settingsComponent: PaymentSettings,
  initialData: { 
    itemName: 'Название товара',
    amount: '100',
    currency: 'RUB',
    provider: 'telegram_payments',
  },
  validationSchema: z.object({
    itemName: z.string().min(1, 'Item Name is required'),
    amount: z.string().min(1, 'Amount is required'),
    currency: z.string().min(1, 'Currency is required'),
    provider: z.string(),
  }),
};