import { BlockConfig, ZodSchema } from '../../../../types';
import ShoppingCartNode from './ShoppingCartNode';
import ShoppingCartSettings from './ShoppingCartSettings';
import { ShoppingCartIcon } from '../../../icons/ShoppingCartIcon';

const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({}) }),
};

export const shoppingCartBlockConfig: BlockConfig = {
  type: 'shoppingCartNode',
  name: 'Корзина',
  icon: ShoppingCartIcon,
  color: 'bg-brand-green',
  component: ShoppingCartNode,
  settingsComponent: ShoppingCartSettings,
  initialData: { 
    action: 'ADD',
    cartVariableName: 'cart',
    item: {
        id: '{product_id}',
        name: '{product_name}',
        price: '{product_price}',
        quantity: '1',
    }
  },
  validationSchema: z.object({
    action: z.string(),
    cartVariableName: z.string().min(1, 'Cart variable name is required'),
  }),
};
