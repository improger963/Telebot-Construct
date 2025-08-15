import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';
import { Product } from '../../../../types';

const ProductCatalogSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);
    
    const [products, setProducts] = useState<Product[]>(node?.data.products || []);

    useEffect(() => {
        if (node) {
            setProducts(node.data.products || []);
        }
    }, [node]);

    if (!node) return null;
    
    const handleUpdate = (updatedProducts: Product[]) => {
        setProducts(updatedProducts);
        updateNodeData(nodeId, { products: updatedProducts });
    }

    const addProduct = () => {
        const newProduct: Product = { id: `prod_${+new Date()}`, name: '', price: 0, description: '', imageUrl: '' };
        handleUpdate([...products, newProduct]);
    };
    
    const removeProduct = (id: string) => {
        handleUpdate(products.filter(p => p.id !== id));
    };
    
    const updateProduct = (id: string, field: keyof Product, value: string | number) => {
        const updated = products.map(p => p.id === id ? { ...p, [field]: value } : p);
        handleUpdate(updated);
    };

    return (
        <div className="space-y-4">
            <SettingRow label="Товары" helpText="Добавьте товары, которые будут показаны пользователю.">
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {products.map((product) => (
                        <div key={product.id} className="bg-input p-4 rounded-lg space-y-3 relative group">
                            <button onClick={() => removeProduct(product.id)} className="absolute top-2 right-2 p-1 text-text-secondary hover:text-brand-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                            <input type="text" placeholder="Название товара" value={product.name} onChange={e => updateProduct(product.id, 'name', e.target.value)} className="w-full px-3 py-2 text-text-primary bg-background rounded-md border-none focus:outline-none focus:ring-2 focus:ring-brand-green"/>
                            <input type="number" placeholder="Цена" value={product.price} onChange={e => updateProduct(product.id, 'price', Number(e.target.value))} className="w-full px-3 py-2 text-text-primary bg-background rounded-md border-none focus:outline-none focus:ring-2 focus:ring-brand-green"/>
                            <textarea placeholder="Описание" value={product.description} onChange={e => updateProduct(product.id, 'description', e.target.value)} rows={2} className="w-full px-3 py-2 text-text-primary bg-background rounded-md border-none focus:outline-none focus:ring-2 focus:ring-brand-green"/>
                            <input type="text" placeholder="URL изображения" value={product.imageUrl} onChange={e => updateProduct(product.id, 'imageUrl', e.target.value)} className="w-full px-3 py-2 text-text-primary bg-background rounded-md border-none focus:outline-none focus:ring-2 focus:ring-brand-green"/>
                        </div>
                    ))}
                </div>
                 <button onClick={addProduct} className="w-full text-sm font-medium text-brand-green p-2 rounded-lg hover:bg-input transition-colors mt-2">
                    + Добавить товар
                </button>
            </SettingRow>
        </div>
    );
};

export default ProductCatalogSettings;
