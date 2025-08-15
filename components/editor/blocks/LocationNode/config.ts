import { BlockConfig, ZodSchema } from '../../../../types';
import LocationNode from './LocationNode';
import LocationSettings from './LocationSettings';
import { LocationIcon } from '../../../icons/LocationIcon';

const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({}) }),
};

export const locationBlockConfig: BlockConfig = {
  type: 'locationNode',
  name: 'Запрос геолокации',
  icon: LocationIcon,
  color: 'bg-brand-green',
  component: LocationNode,
  settingsComponent: LocationSettings,
  initialData: { 
    question: 'Пожалуйста, поделитесь вашим местоположением.',
    latVariable: 'latitude',
    lonVariable: 'longitude',
  },
  validationSchema: z.object({
    question: z.string().min(1, 'Question cannot be empty'),
    latVariable: z.string().min(1, 'Latitude variable name cannot be empty'),
    lonVariable: z.string().min(1, 'Longitude variable name cannot be empty'),
  }),
};
