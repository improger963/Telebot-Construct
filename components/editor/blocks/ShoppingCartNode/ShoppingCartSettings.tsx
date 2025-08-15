import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const ShoppingCartSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);

    const [action, setAction] = useState(node?.data.action || 'ADD');
    const [cartVariableName, setCartVariableName] = useState(node?.data.cartVariableName || 'cart');
    const [item, setItem] = useState(node?.data.item || { id: '', name: '', price: '', quantity: '1' });

    useEffect(() => {
        if (node) {
            setAction(node.data.action || 'ADD');
            setCartVariableName(node.data.cartVariableName || 'cart');
            setItem(node.data.item || { id: '', name: '', price: '', quantity: '1' });
        }
    }, [node]);

    if (!node) return null;

    const handleUpdate = (field: string, value: any) => {
        updateNodeData(nodeId, { [field]: value });
    };

    const handleItemChange = (field: string, value: string) => {
        const newItem = { ...item, [field]: value };
        setItem(newItem);
        handleUpdate('item', newItem);
    };

    return (
        <div className="space-y-6">
            <SettingRow label="Действие">
                <select 
                    value={action} 
                    onChange={e => { setAction(e.target.value); handleUpdate('action', e.target.value); }}
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                    <option value="ADD">Добавить в корзину</option>
                    <option value="VIEW">Показать корзину</option>
                    <option value="CLEAR">Очистить корзину</option>
                </select>
            </SettingRow>

            <SettingRow label="Имя переменной корзины">
                <input
                    type="text"
                    value={cartVariableName}
                    onChange={e => { setCartVariableName(e.target.value); handleUpdate('cartVariableName', e.target.value); }}
                    placeholder="cart"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
            
            {action === 'ADD' && (
                <div className="space-y-4 pt-4 border-t border-accent">
                    <h4 className="font-semibold text-text-primary">Данные товара для добавления</h4>
                    <p className="text-xs text-text-secondary">Используйте переменные, чтобы добавить выбранный пользователем товар.</p>
                     <SettingRow label="ID Товара">
                        <input type="text" value={item.id} onChange={e => handleItemChange('id', e.target.value)} placeholder="{product_id}" className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"/>
                    </SettingRow>
                     <SettingRow label="Название товара">
                        <input type="text" value={item.name} onChange={e => handleItemChange('name', e.target.value)} placeholder="{product_name}" className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"/>
                    </SettingRow>
                     <SettingRow label="Цена">
                        <input type="text" value={item.price} onChange={e => handleItemChange('price', e.target.value)} placeholder="{product_price}" className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"/>
                    </SettingRow>
                     <SettingRow label="Количество">
                        <input type="text" value={item.quantity} onChange={e => handleItemChange('quantity', e.target.value)} placeholder="1" className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"/>
                    </SettingRow>
                </div>
            )}
        </div>
    );
};

export default ShoppingCartSettings;
