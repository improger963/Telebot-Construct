import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useFlowStore } from '../../../../store/flowStore';
import { ProductCatalogIcon } from '../../../icons/ProductCatalogIcon';

const ProductCatalogNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;
  const productCount = data.products?.length || 0;

  return (
    <div className={`w-72 rounded-2xl shadow-lg bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 border-t-4 border-brand-green p-4 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />
      
      <div className="flex items-center gap-3">
         <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand-green/20">
            <ProductCatalogIcon className="h-5 w-5 text-brand-green" />
        </div>
        <div>
            <div className="text-md font-bold text-text-primary">
              Каталог товаров
            </div>
            <p className="text-xs text-text-secondary">{productCount} товар(а/ов)</p>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-primary" />
    </div>
  );
};

export default memo(ProductCatalogNode);
