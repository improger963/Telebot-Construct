import { BotTemplate } from '../types';
import { FormBotIcon } from '../components/icons/FormBotIcon';
import { MessageIcon } from '../components/icons/MessageIcon';
import { ShoppingCartIcon } from '../components/icons/ShoppingCartIcon';

export const botTemplates: BotTemplate[] = [
    {
        id: 'faq',
        name: 'Простой FAQ',
        description: 'Бот, который отвечает на часто задаваемые вопросы с помощью кнопок.',
        icon: MessageIcon,
        flowData: {
            nodes: [
                { id: '1', type: 'startNode', position: { x: 350, y: 50 }, data: { label: 'Старт' } },
                { id: 'msg_1', type: 'messageNode', position: { x: 350, y: 200 }, data: { text: 'Здравствуйте! Чем могу помочь?', buttons: [{ id: 'btn_q1', text: 'Доставка' }, { id: 'btn_q2', text: 'Оплата' }] } },
                { id: 'ans_1', type: 'messageNode', position: { x: 150, y: 400 }, data: { text: 'Мы доставляем по всему городу в течение 60 минут.', buttons: [] } },
                { id: 'ans_2', type: 'messageNode', position: { x: 550, y: 400 }, data: { text: 'Мы принимаем карты и наличные.', buttons: [] } }
            ],
            edges: [
                { id: 'e1-msg1', source: '1', target: 'msg_1', animated: true },
                { id: 'emsg1-ans1', source: 'msg_1', target: 'ans_1', sourceHandle: 'btn_q1', animated: true },
                { id: 'emsg1-ans2', source: 'msg_1', target: 'ans_2', sourceHandle: 'btn_q2', animated: true }
            ],
        },
    },
    {
        id: 'feedback',
        name: 'Сбор обратной связи',
        description: 'Простая форма для сбора оценки и комментариев от пользователей.',
        icon: FormBotIcon,
        flowData: {
            nodes: [
                { id: '1', type: 'startNode', position: { x: 350, y: 50 }, data: { label: 'Старт' } },
                { id: 'inp_1', type: 'inputNode', position: { x: 350, y: 200 }, data: { question: 'Пожалуйста, оцените наш сервис от 1 до 5.', variableName: 'rating' } },
                { id: 'inp_2', type: 'inputNode', position: { x: 350, y: 400 }, data: { question: 'Спасибо! Оставьте ваш комментарий.', variableName: 'comment' } },
                { id: 'msg_final', type: 'messageNode', position: { x: 350, y: 600 }, data: { text: 'Спасибо за ваш отзыв!', buttons: [] } }
            ],
            edges: [
                { id: 'e1-inp1', source: '1', target: 'inp_1', animated: true },
                { id: 'einp1-inp2', source: 'inp_1', target: 'inp_2', animated: true },
                { id: 'einp2-msg_final', source: 'inp_2', target: 'msg_final', animated: true },
            ],
        },
    },
    {
        id: 'pizza_shop',
        name: 'Магазин пиццы',
        description: 'Простой e-commerce бот для заказа пиццы с использованием новых блоков.',
        icon: ShoppingCartIcon,
        flowData: {
            nodes: [
                { id: '1', type: 'startNode', position: { x: 350, y: 50 }, data: { label: 'Старт' } },
                { id: 'catalog', type: 'productCatalogNode', position: { x: 350, y: 200 }, data: { products: [{ id: 'pizza1', name: 'Пепперони', price: 500, description: 'Классическая пицца с пепперони.', imageUrl: 'https://i.imgur.com/25YSExc.png' }, { id: 'pizza2', name: 'Маргарита', price: 450, description: 'Томатный соус, моцарелла и базилик.', imageUrl: 'https://i.imgur.com/s4p7m6A.png' }] } },
                { id: 'ask_which_pizza', type: 'messageNode', position: { x: 350, y: 400 }, data: { text: 'Какую пиццу вы хотите добавить в корзину?', buttons: [{id: 'btn_pep', text: 'Пепперони'}, {id: 'btn_mar', text: 'Маргарита'}]} },
                { id: 'cart_add_pep', type: 'shoppingCartNode', position: { x: 150, y: 600 }, data: { action: 'ADD', cartVariableName: 'cart', item: { id: 'pep', name: 'Пепперони', price: '500', quantity: '1' } } },
                { id: 'cart_add_mar', type: 'shoppingCartNode', position: { x: 550, y: 600 }, data: { action: 'ADD', cartVariableName: 'cart', item: { id: 'mar', name: 'Маргарита', price: '450', quantity: '1' } } },
                { id: 'ask_more', type: 'messageNode', position: { x: 350, y: 800 }, data: { text: 'Отлично! Добавлено в корзину. Хотите что-нибудь еще?', buttons: [{ id: 'btn_continue', text: 'Продолжить выбор' }, { id: 'btn_checkout', text: 'Оформить заказ' }] } },
                { id: 'view_cart', type: 'shoppingCartNode', position: { x: 550, y: 1000 }, data: { action: 'VIEW', cartVariableName: 'cart' } },
                { id: 'payment', type: 'paymentNode', position: { x: 550, y: 1200 }, data: { itemName: 'Заказ из Пиццерии', amount: 'Сумма из корзины', currency: 'RUB' } },
                { id: 'msg_success', type: 'messageNode', position: { x: 350, y: 1400 }, data: { text: 'Оплата прошла успешно! Ваш заказ готовится.' } },
                { id: 'msg_fail', type: 'messageNode', position: { x: 750, y: 1400 }, data: { text: 'Произошла ошибка оплаты. Попробуйте еще раз.' } }
            ],
            edges: [
                { id: 'e1', source: '1', target: 'catalog', animated: true },
                { id: 'e2', source: 'catalog', target: 'ask_which_pizza', animated: true },
                { id: 'e3a', source: 'ask_which_pizza', target: 'cart_add_pep', sourceHandle: 'btn_pep', animated: true },
                { id: 'e3b', source: 'ask_which_pizza', target: 'cart_add_mar', sourceHandle: 'btn_mar', animated: true },
                { id: 'e4a', source: 'cart_add_pep', target: 'ask_more', animated: true },
                { id: 'e4b', source: 'cart_add_mar', target: 'ask_more', animated: true },
                { id: 'e5a', source: 'ask_more', target: 'catalog', sourceHandle: 'btn_continue', animated: true },
                { id: 'e5b', source: 'ask_more', target: 'view_cart', sourceHandle: 'btn_checkout', animated: true },
                { id: 'e6', source: 'view_cart', target: 'payment', animated: true },
                { id: 'e7a', source: 'payment', target: 'msg_success', sourceHandle: 'success', animated: true },
                { id: 'e7b', source: 'payment', target: 'msg_fail', sourceHandle: 'failure', animated: true }
            ],
        },
    }
];