import { BlockConfig, ZodSchema } from '../../../../types';
import ProductCatalogNode from './ProductCatalogNode';
import ProductCatalogSettings from './ProductCatalogSettings';
import { ProductCatalogIcon } from '../../../icons/ProductCatalogIcon';

const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  array: (_element: any) => ({}),
};

export const productCatalogBlockConfig: BlockConfig = {
  type: 'productCatalogNode',
  name: 'Каталог товаров',
  icon: ProductCatalogIcon,
  color: 'bg-brand-green',
  component: ProductCatalogNode,
  settingsComponent: ProductCatalogSettings,
  initialData: { 
    products: [
        { id: `prod_${+new Date()}`, name: 'Пример товара', price: 100, description: 'Отличное описание товара.', imageUrl: '' }
    ]
  },
  validationSchema: z.object({
    products: z.array(z.object({})),
  }),
};
