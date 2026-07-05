import { Link } from '@inertiajs/react';
import {
    Bell,
    CheckCircle,
    Heart,
    MessageSquare,
    Search,
    Send,
    Settings,
    Trash2,
    User,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';

import { FILTER_SUBSCRIPTION_STATUS, formatFilterSubscriptionCriteria, formatFilterSubscriptionTitle } from '@/entities/filter-subscription/model/formatters';
import { useFilterSubscriptions } from '@/entities/filter-subscription/model/useFilterSubscriptions';
import { useUserNotifications } from '@/entities/notification/model/useUserNotifications';
import type { AccountNotification } from '@/entities/notification/model/types';
import AppLayout from '@/shared/layout/AppLayout';
import Button from '@/shared/ui/Button';
import Card from '@/shared/ui/Card';
import Checkbox from '@/shared/ui/Checkbox';

interface FavoriteItem {
    id: number;
    title: string;
    meta: string;
    price: string;
    image: string;
}

interface NotificationItem {
    id: string;
    type: 'subscription' | 'favorite' | 'message' | 'verification';
    icon: ReactNode;
    title: string;
    text: string;
    time: string;
    unread: boolean;
}

interface ChatMessage {
    id: number;
    sender: 'user' | 'seller';
    text: string;
    time: string;
}

interface ChatThread {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    unread: boolean;
    messages: ChatMessage[];
}

export default function Account() {
    // Navigation Active Tab state
    const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'subscriptions' | 'notifications' | 'messages' | 'settings'>('subscriptions');
    const {
        subscriptions,
        isLoading: isLoadingSubscriptions,
        error: subscriptionsError,
        reload: reloadSubscriptions,
        updateStatus: updateSubscriptionStatus,
    } = useFilterSubscriptions();
    const {
        notifications: accountNotifications,
        isLoading: isLoadingNotifications,
        error: notificationsError,
        reload: reloadNotifications,
    } = useUserNotifications();

    // Favorites state
    const [favorites, setFavorites] = useState<FavoriteItem[]>([
        {
            id: 1,
            title: 'Toyota Camry 2.5',
            meta: '2021 · 42 000 км · бензин · Алматы',
            price: '$26 000',
            image: 'https://images.unsplash.com/photo-1549927681-0b673b8243ab?auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 2,
            title: 'Tesla Model 3 Long Range',
            meta: '2022 · 18 000 км · электро · Астана',
            price: '$39 000',
            image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=500&q=80'
        }
    ]);

    // Subscriptions tab segment filter: all / active / paused
    const [subFilter, setSubFilter] = useState<'all' | 'active' | 'paused'>('all');
    const [updatingSubscriptionIds, setUpdatingSubscriptionIds] = useState<Set<string>>(() => new Set());

    const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(() => new Set());

    // Notifications category filter: all / subscription / favorite / message
    const [notifFilter, setNotifFilter] = useState<'all' | 'subscription' | 'favorite' | 'message'>('all');
    const [notifSort, setNotifSort] = useState<'newest' | 'unread'>('newest');

    // Messages/Dialogues state with active chat simulation
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [chats, setChats] = useState<ChatThread[]>([
        {
            id: 1,
            name: 'Дилер AutoLine',
            avatar: 'AL',
            lastMessage: 'Готовы показать Camry сегодня после 17:00.',
            unread: true,
            messages: [
                { id: 1, sender: 'seller', text: 'Здравствуйте! Интересует Toyota Camry 2.5?', time: 'Вчера, 12:40' },
                { id: 2, sender: 'user', text: 'Да, когда можно осмотреть кузов и сделать тест-драйв?', time: 'Вчера, 14:15' },
                { id: 3, sender: 'seller', text: 'Готовы показать Camry сегодня после 17:00.', time: 'Вчера, 14:18' }
            ]
        },
        {
            id: 2,
            name: 'Продавец Tesla',
            avatar: 'TM',
            lastMessage: 'Историю обслуживания отправил в чат.',
            unread: false,
            messages: [
                { id: 1, sender: 'seller', text: 'История обслуживания Tesla Model 3 чистая.', time: '2 дня назад' },
                { id: 2, sender: 'seller', text: 'Историю обслуживания отправил в чат.', time: '2 дня назад' }
            ]
        }
    ]);

    // Personal Settings states
    const [contactName, setContactName] = useState('Максим');
    const [contactEmail, setContactEmail] = useState('maxim@example.com');
    const [contactPhone, setContactPhone] = useState('+7 700 000 00 00');
    const [contactTelegram, setContactTelegram] = useState('@maxim_auto');
    const [contactCity, setContactCity] = useState('Алматы');

    // Channels state
    const [channels, setChannels] = useState({
        email: true,
        telegram: true,
        sms: false,
        push: true,
        whatsapp: false
    });

    // Preference table switches
    const [preferences, setPreferences] = useState({
        matches: { email: true, telegram: true, sms: false, push: true },
        priceDrop: { email: true, telegram: true, sms: false, push: true },
        replies: { email: true, telegram: true, sms: true, push: true },
        marketing: { email: true, telegram: false, sms: false, push: false }
    });

    // Quiet hours settings
    const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
    const [quietStart, setQuietStart] = useState('22:00');
    const [quietEnd, setQuietEnd] = useState('08:00');

    // Toast / System updates state
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    // Profile Save handler
    const handleSaveSettings = () => {
        showToast('Настройки профиля успешно сохранены!');
    };

    // Mark all notifications as read
    const handleMarkAllRead = () => {
        setReadNotificationIds(new Set(accountNotifications.map(notification => notification.id)));
        showToast('Все уведомления отмечены как прочитанные');
    };

    // Remove Favorite
    const removeFavorite = (id: number) => {
        setFavorites(favorites.filter(f => f.id !== id));
        showToast('Удалено из избранного');
    };

    const toggleSubscriptionStatus = async (id: string) => {
        const subscription = subscriptions.find(item => item.id === id);

        if (!subscription || updatingSubscriptionIds.has(id)) {
            return;
        }

        const nextStatus = subscription.status === FILTER_SUBSCRIPTION_STATUS.active
            ? FILTER_SUBSCRIPTION_STATUS.paused
            : FILTER_SUBSCRIPTION_STATUS.active;

        setUpdatingSubscriptionIds(prev => new Set(prev).add(id));

        try {
            await updateSubscriptionStatus(subscription, nextStatus);
            showToast(nextStatus === FILTER_SUBSCRIPTION_STATUS.active ? 'Подписка возобновлена' : 'Подписка остановлена');
        } catch (caught) {
            showToast(caught instanceof Error ? caught.message : 'Не удалось изменить подписку');
        } finally {
            setUpdatingSubscriptionIds(prev => {
                const next = new Set(prev);
                next.delete(id);

                return next;
            });
        }
    };

    // Filter Subscriptions computed list
    const filteredSubs = useMemo(() => {
        if (subFilter === 'active') return subscriptions.filter(s => s.status === FILTER_SUBSCRIPTION_STATUS.active);
        if (subFilter === 'paused') return subscriptions.filter(s => s.status === FILTER_SUBSCRIPTION_STATUS.paused);
        return subscriptions;
    }, [subscriptions, subFilter]);

    // Filter Notifications computed list
    const notifications = useMemo(
        () => accountNotifications.map(notification => toNotificationItem(notification, readNotificationIds)),
        [accountNotifications, readNotificationIds],
    );

    const filteredNotifications = useMemo(() => {
        let list = [...notifications];
        if (notifFilter !== 'all') {
            list = list.filter(n => n.type === notifFilter);
        }
        if (notifSort === 'unread') {
            list = list.filter(n => n.unread);
        }
        return list;
    }, [notifications, notifFilter, notifSort]);

    // Send Message inside Simulated Chat
    const handleSendMessage = () => {
        if (!replyText.trim() || selectedChatId === null) return;

        const newMsg: ChatMessage = {
            id: Date.now(),
            sender: 'user',
            text: replyText,
            time: 'Только что'
        };

        // Add message to chat log
        setChats(prev => prev.map(c => {
            if (c.id === selectedChatId) {
                return {
                    ...c,
                    lastMessage: replyText,
                    messages: [...c.messages, newMsg]
                };
            }
            return c;
        }));

        setReplyText('');

        // Simulate seller automated response
        setTimeout(() => {
            const sellerReply: ChatMessage = {
                id: Date.now() + 1,
                sender: 'seller',
                text: `Спасибо за ваш ответ! Менеджер свяжется с вами в ближайшее время.`,
                time: 'Только что'
            };

            setChats(prev => prev.map(c => {
                if (c.id === selectedChatId) {
                    return {
                        ...c,
                        lastMessage: sellerReply.text,
                        messages: [...c.messages, sellerReply]
                    };
                }
                return c;
            }));
        }, 1500);
    };

    // Open Chat Dialogue
    const openChat = (id: number) => {
        setSelectedChatId(id);
        setChats(chats.map(c => c.id === id ? { ...c, unread: false } : c));
    };

    const navItems: Array<{
        key: typeof activeTab;
        label: string;
        icon: ReactNode;
        placeholder?: boolean;
    }> = [
            { key: 'overview', label: 'Обзор', icon: <User size={16} />, placeholder: true },
            { key: 'favorites', label: 'Избранное', icon: <Heart size={16} />, placeholder: true },
            { key: 'subscriptions', label: 'Подписки', icon: <Search size={16} /> },
            { key: 'notifications', label: 'Уведомления', icon: <Bell size={16} /> },
            { key: 'messages', label: 'Диалоги', icon: <MessageSquare size={16} />, placeholder: true },
            { key: 'settings', label: 'Настройки', icon: <Settings size={16} /> },
        ];

    const handleNavClick = (item: (typeof navItems)[number]) => {
        if (item.placeholder) {
            showToast(`Раздел "${item.label}" пока заглушка`);
            return;
        }

        setActiveTab(item.key);
    };

    return (
        <AppLayout
            navItems={[
                { label: 'Каталог', href: '/catalog' },
                { label: 'Подписки', onClick: () => setActiveTab('subscriptions'), active: activeTab === 'subscriptions' },
                { label: 'Уведомления', onClick: () => setActiveTab('notifications'), active: activeTab === 'notifications' },
                { label: 'Настройки', onClick: () => setActiveTab('settings'), active: activeTab === 'settings' },
            ]}
            actions={(
                <>
                    <Button variant="outline" size="sm" className="h-9 px-4">
                        Выйти
                    </Button>
                    <Button href="/catalog" variant="default" size="sm" className="h-9 px-4">
                        В каталог
                    </Button>
                </>
            )}
        >

            {/* Global Toast */}
            {toastMsg && (
                <div className="fixed bottom-6 right-6 z-50 flex select-none items-center gap-2.5 rounded-md border border-zinc-800 bg-zinc-900 p-4 text-white shadow-lg">
                    <CheckCircle className="text-green-400 size-5" />
                    <span className="text-sm font-medium">{toastMsg}</span>
                </div>
            )}

            {/* Hero breadcrumbs */}
            <section className="border-b border-zinc-200 bg-white py-7">
                <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-1.5 text-xs text-zinc-500">
                            <Link href="/" className="hover:text-zinc-900">Главная</Link>
                            <span>/</span>
                            <span className="text-zinc-800">Кабинет</span>
                        </div>
                        <h1 className="text-3xl font-semibold tracking-normal text-zinc-900">Личный кабинет</h1>
                        <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                            Следите за избранными автомобилями, подписками, уведомлениями и переговорами с продавцами.
                        </p>
                    </div>

                    {/* Profile Card */}
                    <div className="flex min-w-[280px] items-center gap-3 rounded-md border border-zinc-200 bg-white p-3.5">
                        <div className="flex size-11 items-center justify-center rounded-md bg-zinc-950 text-sm font-medium text-white">
                            {contactName ? contactName.substring(0, 2).toUpperCase() : 'МК'}
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <strong className="text-sm font-semibold text-zinc-900">{contactName} К.</strong>
                            <span className="text-xs text-zinc-400 truncate">{contactEmail}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard main layout */}
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr]">

                {/* Account Sidebar navigation */}
                <aside className="sticky top-20 flex flex-row gap-1 overflow-x-auto rounded-md border border-zinc-200 bg-white p-2 lg:flex-col">
                    {navItems.map(item => (
                        <button
                            key={item.key}
                            onClick={() => handleNavClick(item)}
                            title={item.placeholder ? 'Раздел пока заглушка' : undefined}
                            className={`relative flex min-h-[38px] items-center gap-2.5 whitespace-nowrap rounded-md border px-3.5 text-left text-sm font-medium transition-colors lg:w-full ${activeTab === item.key
                                    ? 'border-zinc-950 bg-zinc-950 text-white'
                                    : item.placeholder
                                        ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                                        : 'border-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                                }`}
                        >
                            <span className={activeTab === item.key ? 'text-white' : item.placeholder ? 'text-amber-700' : 'text-zinc-700'}>
                                {item.icon}
                            </span>
                            {item.label}
                            {item.placeholder && (
                                <span className="ml-auto rounded-full border border-amber-200 bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                                    Скоро
                                </span>
                            )}
                            {item.key === 'notifications' && notifications.filter(n => n.unread).length > 0 && (
                                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-red-500 border border-white" />
                            )}
                        </button>
                    ))}
                </aside>

                {/* Tab content workspace panels */}
                <section className="space-y-6">

                    {/* TAB 1: OVERVIEW SUMMARY */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Card className="p-4 grid gap-1 shadow-sm cursor-pointer hover:border-zinc-300 transition-colors" onClick={() => setActiveTab('favorites')}>
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Избранное</span>
                                    <strong className="text-3xl font-semibold text-zinc-950 leading-none mt-1">{favorites.length}</strong>
                                    <p className="text-[13px] text-zinc-500 font-medium mt-1">2 автомобиля обновили цену за вчера</p>
                                </Card>
                                <Card className="p-4 grid gap-1 shadow-sm cursor-pointer hover:border-zinc-300 transition-colors" onClick={() => setActiveTab('subscriptions')}>
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Подписки</span>
                                    <strong className="text-3xl font-semibold text-zinc-950 leading-none mt-1">{subscriptions.length}</strong>
                                    <p className="text-[13px] text-zinc-500 font-medium mt-1">18 новых совпадений за неделю</p>
                                </Card>
                                <Card className="p-4 grid gap-1 shadow-sm cursor-pointer hover:border-zinc-300 transition-colors" onClick={() => setActiveTab('messages')}>
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Диалоги</span>
                                    <strong className="text-3xl font-semibold text-zinc-950 leading-none mt-1">{chats.length}</strong>
                                    <p className="text-[13px] text-zinc-500 font-medium mt-1">1 ожидает ответа продавца</p>
                                </Card>
                            </div>

                            {/* Compact Favorites Panel */}
                            <Card className="p-5 shadow-sm space-y-4">
                                <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                                    <div>
                                        <h2 className="text-base font-bold text-zinc-950">Избранные автомобили</h2>
                                        <p className="text-xs text-zinc-500">Короткий список автомобилей, к которым планируете вернуться</p>
                                    </div>
                                    <Button onClick={() => setActiveTab('favorites')} variant="outline" size="sm" className="h-8">Открыть все</Button>
                                </div>
                                <div className="divide-y divide-zinc-100">
                                    {favorites.slice(0, 2).map(f => (
                                        <div key={f.id} className="flex gap-4 py-3 first:pt-0 last:pb-0 items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src={f.image} alt={f.title} className="size-12 object-cover rounded border border-zinc-200" />
                                                <div>
                                                    <h3 className="text-sm font-bold text-zinc-900">{f.title}</h3>
                                                    <p className="text-xs text-zinc-400 font-medium">{f.meta}</p>
                                                </div>
                                            </div>
                                            <strong className="text-sm font-semibold text-zinc-900">{f.price}</strong>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Subscriptions & Channels Panel */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Subscriptions */}
                                <Card className="p-5 shadow-sm space-y-4">
                                    <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                                        <h2 className="text-base font-bold text-zinc-900">Мои подписки</h2>
                                        <Button onClick={() => setActiveTab('subscriptions')} variant="outline" size="sm" className="h-8">Управлять</Button>
                                    </div>
                                    <div className="space-y-2">
                                        {subscriptions.slice(0, 2).map(sub => (
                                            <div key={sub.id} className="border border-zinc-200 rounded p-3 flex justify-between items-center bg-zinc-50">
                                                <div>
                                                    <strong className="text-[13px] font-bold text-zinc-800">{formatFilterSubscriptionTitle(sub)}</strong>
                                                    <p className="text-xs text-zinc-400 truncate max-w-[200px] mt-0.5">{formatFilterSubscriptionCriteria(sub)}</p>
                                                </div>
                                                <span className="text-xs font-semibold bg-white border border-zinc-200 px-2 py-0.5 rounded shadow-sm text-zinc-950">
                                                    #{sub.id}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {/* Simulated notifications timeline */}
                                <Card className="p-5 shadow-sm space-y-4">
                                    <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                                        <h2 className="text-base font-bold text-zinc-900">Свежие события</h2>
                                        <Button onClick={() => setActiveTab('notifications')} variant="outline" size="sm" className="h-8">Новости</Button>
                                    </div>
                                    <div className="space-y-4 pr-1">
                                        {notifications.slice(0, 3).map(notif => (
                                            <div key={notif.id} className="flex gap-2.5">
                                                <span className="size-2 bg-zinc-950 rounded-full mt-1.5 shrink-0" />
                                                <div>
                                                    <p className="text-[13px] text-zinc-700 leading-tight font-medium">
                                                        <strong className="font-bold text-zinc-950">{notif.title}</strong>: {notif.text}
                                                    </p>
                                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide block mt-1">{notif.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: FAVORITES VIEWS */}
                    {activeTab === 'favorites' && (
                        <Card className="p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start gap-4 border-b border-zinc-100 pb-3 flex-wrap">
                                <div>
                                    <h2 className="text-lg font-bold text-zinc-900">Избранные автомобили</h2>
                                    <p className="text-xs text-zinc-500 mt-0.5">Второй список ваших предложений, которые вы сохранили для последующей покупки</p>
                                </div>
                                <Button href="/catalog" variant="outline" className="h-9 font-bold bg-white text-zinc-700">
                                    Найти еще авто
                                </Button>
                            </div>

                            <div className="divide-y divide-zinc-100">
                                {favorites.map(f => (
                                    <article key={f.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <img src={f.image} alt={f.title} className="w-20 h-16 object-cover rounded border border-zinc-200" />
                                            <div>
                                                <h3 className="font-bold text-sm text-zinc-950 leading-tight">{f.title}</h3>
                                                <p className="text-xs text-zinc-500 mt-1 font-medium">{f.meta}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-5">
                                            <strong className="text-base font-semibold text-zinc-900">{f.price}</strong>
                                            <div className="flex gap-2">
                                                <Button href="/catalog" variant="outline" size="sm" className="h-8 font-bold text-zinc-700 bg-white">
                                                    Открыть
                                                </Button>
                                                <button onClick={() => removeFavorite(f.id)} className="text-zinc-400 hover:text-red-600 bg-white border border-zinc-200 hover:bg-red-50 p-2 rounded shadow-sm transition-all">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                                {favorites.length === 0 && (
                                    <div className="text-center py-10 text-zinc-400 text-sm">В списке избранного пока ничего нет</div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* TAB 3: SUBSCRIPTIONS PANEL */}
                    {activeTab === 'subscriptions' && (
                        <div className="space-y-4">
                            <Card className="p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="inline-flex rounded-md border border-zinc-200 p-0.5 bg-zinc-50 gap-0.5">
                                    <button onClick={() => setSubFilter('all')} className={`text-xs font-semibold px-3 py-1.5 rounded-sm transition-all ${subFilter === 'all' ? 'bg-white shadow text-zinc-950' : 'text-zinc-400 hover:text-zinc-800'}`}>Все</button>
                                    <button onClick={() => setSubFilter('active')} className={`text-xs font-semibold px-3 py-1.5 rounded-sm transition-all ${subFilter === 'active' ? 'bg-white shadow text-zinc-950' : 'text-zinc-400 hover:text-zinc-800'}`}>Активные</button>
                                    <button onClick={() => setSubFilter('paused')} className={`text-xs font-semibold px-3 py-1.5 rounded-sm transition-all ${subFilter === 'paused' ? 'bg-white shadow text-zinc-950' : 'text-zinc-400 hover:text-zinc-800'}`}>На паузе</button>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={reloadSubscriptions} variant="outline" size="sm" className="h-8 font-bold">Обновить</Button>
                                    <Button href="/catalog" variant="default" size="sm" className="h-8 font-bold">Создать подписку</Button>
                                </div>
                            </Card>

                            {subscriptionsError && (
                                <Card className="border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                                    {subscriptionsError}
                                </Card>
                            )}

                            {isLoadingSubscriptions && (
                                <Card className="p-8 text-center text-sm font-medium text-zinc-400">
                                    Загружаем подписки...
                                </Card>
                            )}

                            <div className="space-y-3">
                                {!isLoadingSubscriptions && filteredSubs.map(sub => (
                                    <Card key={sub.id} className={`p-4 shadow-sm space-y-4 transition-colors ${sub.status === FILTER_SUBSCRIPTION_STATUS.paused ? 'bg-zinc-50 border-zinc-200 opacity-80' : 'bg-white border-zinc-200'}`}>
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${sub.status === FILTER_SUBSCRIPTION_STATUS.active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        }`}>
                                                        {sub.status === FILTER_SUBSCRIPTION_STATUS.active ? 'Активна' : 'Пауза'}
                                                    </span>
                                                </div>
                                                <h2 className="text-base font-bold text-zinc-900 mt-2">{formatFilterSubscriptionTitle(sub)}</h2>
                                                <p className="text-xs text-zinc-500 font-medium mt-0.5">{formatFilterSubscriptionCriteria(sub)}</p>
                                            </div>
                                            <span className="text-sm font-semibold text-zinc-950 bg-white border border-zinc-200 rounded px-2 py-1 shadow-sm shrink-0">
                                                #{sub.id}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 border-t border-zinc-100/70 pt-3">
                                            <span className="inline-flex rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                                {sub.user_identifier}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 pt-1">
                                            <Button
                                                onClick={() => void toggleSubscriptionStatus(sub.id)}
                                                variant={sub.status === FILTER_SUBSCRIPTION_STATUS.active ? 'outline' : 'default'}
                                                size="sm"
                                                disabled={updatingSubscriptionIds.has(sub.id)}
                                                className="h-8 font-semibold"
                                            >
                                                {updatingSubscriptionIds.has(sub.id)
                                                    ? 'Сохраняем...'
                                                    : sub.status === FILTER_SUBSCRIPTION_STATUS.active ? 'Остановить' : 'Возобновить'}
                                            </Button>
                                            <Button href="/catalog" variant="outline" size="sm" className="h-8 font-semibold text-zinc-700 bg-white">
                                                Открыть каталог
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                                {!isLoadingSubscriptions && filteredSubs.length === 0 && (
                                    <Card className="p-8 text-center text-sm font-medium text-zinc-400">
                                        Подписки не найдены
                                    </Card>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 4: NOTIFICATIONS TIMELINE */}
                    {activeTab === 'notifications' && (
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6 items-start">

                            {/* Left timeline section */}
                            <div className="space-y-4">
                                <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm select-none">
                                    <div className="inline-flex rounded-md border border-zinc-200 p-0.5 bg-zinc-50 gap-0.5 flex-wrap">
                                        {[
                                            { key: 'all', label: 'Все' },
                                            { key: 'subscription', label: 'Подписки' },
                                            { key: 'favorite', label: 'Избранное' },
                                            { key: 'message', label: 'Диалоги' }
                                        ].map(tab => (
                                            <button
                                                key={tab.key}
                                                onClick={() => setNotifFilter(tab.key as any)}
                                                className={`text-xs font-semibold px-2.5 py-1.5 rounded-sm transition-all ${notifFilter === tab.key ? 'bg-white shadow text-zinc-950' : 'text-zinc-400 hover:text-zinc-800'
                                                    }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 self-end sm:self-auto">
                                        <select value={notifSort} onChange={e => setNotifSort(e.target.value as any)} className="h-8 border border-zinc-200 bg-white text-xs font-semibold rounded px-2 focus:outline-none">
                                            <option value="newest">Сначала новые</option>
                                            <option value="unread">Только непрочитанные</option>
                                        </select>
                                        <Button onClick={reloadNotifications} variant="outline" size="sm" className="h-8 text-xs font-semibold text-zinc-700 bg-white">
                                            Обновить
                                        </Button>
                                        <Button onClick={handleMarkAllRead} variant="outline" size="sm" className="h-8 text-xs font-semibold text-zinc-700 bg-white">
                                            Прочитано
                                        </Button>
                                    </div>
                                </Card>

                                {notificationsError && (
                                    <Card className="border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                                        {notificationsError}
                                    </Card>
                                )}

                                {isLoadingNotifications && (
                                    <Card className="p-8 text-center text-sm font-medium text-zinc-400">
                                        Загружаем уведомления...
                                    </Card>
                                )}

                                <div className="space-y-3">
                                    {!isLoadingNotifications && filteredNotifications.map(notif => (
                                        <Card key={notif.id} className={`p-4 shadow-sm flex items-start gap-4 transition-all ${notif.unread ? 'border-zinc-900 bg-white ring-1 ring-zinc-900' : 'bg-white border-zinc-200'}`}>
                                            <div className="size-9 bg-zinc-100 rounded border border-zinc-200 text-sm font-bold flex items-center justify-center text-zinc-800 shrink-0">
                                                {notif.icon}
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <div className="flex justify-between items-start gap-4">
                                                    <h2 className="text-sm font-bold text-zinc-900 leading-snug">{notif.title}</h2>
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 mt-0.5">{notif.time}</span>
                                                </div>
                                                <p className="text-xs text-zinc-500 leading-normal font-medium">{notif.text}</p>

                                                <div className="flex gap-2 pt-2">
                                                    <Button href="/catalog" variant="default" size="sm" className="h-8 text-xs font-semibold px-3">
                                                        Посмотреть
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                    {!isLoadingNotifications && filteredNotifications.length === 0 && (
                                        <Card className="p-8 text-center text-zinc-400 text-xs font-semibold">Уведомления отсутствуют</Card>
                                    )}
                                </div>
                            </div>

                            {/* Right channels panel */}
                            <Card className="p-5 shadow-sm space-y-4">
                                <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                                    <h3 className="font-bold text-zinc-900 text-sm">Каналы доставки</h3>
                                    <button onClick={() => setActiveTab('settings')} className="text-xs font-bold text-zinc-400 hover:text-zinc-800">Изменить</button>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { key: 'email', label: 'Email', meta: 'Включён для всех событий' },
                                        { key: 'telegram', label: 'Telegram', meta: 'Только важные совпадения' },
                                        { key: 'push', label: 'Push', meta: 'Избранное и предложения' },
                                        { key: 'sms', label: 'SMS', meta: 'Отключён' }
                                    ].map(channel => {
                                        const isEnabled = (channels as any)[channel.key];
                                        return (
                                            <div key={channel.key} className="flex gap-3">
                                                <span className={`size-2.5 rounded-full mt-2 shrink-0 ${isEnabled ? 'bg-zinc-950' : 'bg-zinc-300'}`} />
                                                <div>
                                                    <h4 className="text-xs font-bold text-zinc-900">{channel.label}</h4>
                                                    <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{channel.meta}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* TAB 5: MESSAGES DIALOGUES */}
                    {activeTab === 'messages' && (
                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 bg-white border border-zinc-200 rounded-lg min-h-[500px] overflow-hidden shadow-sm">

                            {/* Conversations Left Panel */}
                            <div className="border-r border-zinc-200 flex flex-col">
                                <div className="p-4 border-b border-zinc-100 flex items-center gap-2">
                                    <MessageSquare size={16} className="text-zinc-600" />
                                    <span className="text-sm font-semibold text-zinc-900">Разговоры</span>
                                </div>
                                <div className="flex-1 overflow-y-auto divide-y divide-zinc-50">
                                    {chats.map(chat => (
                                        <button
                                            key={chat.id}
                                            onClick={() => openChat(chat.id)}
                                            className={`w-full p-4 flex gap-3 text-left transition-all hover:bg-zinc-50 select-none ${selectedChatId === chat.id ? 'bg-zinc-50' : ''
                                                }`}
                                        >
                                            <div className="size-9 rounded bg-zinc-950 font-semibold text-sm text-white flex items-center justify-center shrink-0">
                                                {chat.avatar}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline">
                                                    <strong className="text-xs font-bold text-zinc-900 truncate">{chat.name}</strong>
                                                    {chat.unread && (
                                                        <span className="size-2 rounded-full bg-zinc-900 shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-zinc-400 truncate mt-1 leading-normal font-medium">{chat.lastMessage}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Chat View Right Panel */}
                            <div className="flex flex-col h-full bg-zinc-50">
                                {selectedChatId !== null ? (
                                    <>
                                        {/* Chat Header */}
                                        <div className="bg-white border-b border-zinc-200 p-4 flex items-center gap-3">
                                            <div className="size-8 rounded bg-zinc-950 font-bold text-xs text-white flex items-center justify-center">
                                                {chats.find(c => c.id === selectedChatId)?.avatar}
                                            </div>
                                            <span className="font-semibold text-sm text-zinc-900">
                                                {chats.find(c => c.id === selectedChatId)?.name}
                                            </span>
                                        </div>

                                        {/* Message Box logs */}
                                        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[350px]">
                                            {chats.find(c => c.id === selectedChatId)?.messages.map(msg => {
                                                const isUser = msg.sender === 'user';
                                                return (
                                                    <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[70%] rounded-md p-3.5 shadow-sm text-xs font-semibold leading-normal ${isUser ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900 border border-zinc-200'
                                                            }`}>
                                                            <p>{msg.text}</p>
                                                            <span className={`block text-[9px] uppercase tracking-wide font-bold mt-1 text-right ${isUser ? 'text-zinc-400' : 'text-zinc-400'
                                                                }`}>
                                                                {msg.time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Input Reply Panel */}
                                        <div className="bg-white border-t border-zinc-200 p-4 flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Напишите ответ..."
                                                value={replyText}
                                                onChange={e => setReplyText(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                                className="flex-1 h-10 border border-zinc-200 px-3.5 text-sm rounded bg-zinc-50 focus:bg-white outline-none"
                                            />
                                            <Button onClick={handleSendMessage} variant="default" className="h-10 px-4 font-bold shrink-0">
                                                <Send size={15} /> Отправить
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-6">
                                        <MessageSquare size={36} className="text-zinc-300" />
                                        <p className="text-xs font-bold uppercase tracking-wider mt-3">Выберите чат для начала общения</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}

                    {/* TAB 6: PROFILE DETAILS & SETTINGS */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">

                            {/* Personal Contacts */}
                            <Card className="p-5 shadow-sm space-y-4">
                                <div className="border-b border-zinc-100 pb-2">
                                    <h2 className="text-base font-bold text-zinc-900">Контакты</h2>
                                    <p className="text-xs text-zinc-500 mt-0.5">Данные используются продавцами для оперативной обратной связи по вашим заявкам</p>
                                </div>
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="grid gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                        Имя
                                        <input
                                            type="text"
                                            value={contactName}
                                            onChange={e => setContactName(e.target.value)}
                                            className="h-10 text-sm font-semibold border border-zinc-200 px-3 rounded focus:bg-white bg-zinc-50 outline-none w-full"
                                        />
                                    </label>
                                    <label className="grid gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                        Email
                                        <input
                                            type="email"
                                            value={contactEmail}
                                            onChange={e => setContactEmail(e.target.value)}
                                            className="h-10 text-sm font-semibold border border-zinc-200 px-3 rounded focus:bg-white bg-zinc-50 outline-none w-full"
                                        />
                                    </label>
                                    <label className="grid gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                        Телефон
                                        <input
                                            type="tel"
                                            value={contactPhone}
                                            onChange={e => setContactPhone(e.target.value)}
                                            className="h-10 text-sm font-semibold border border-zinc-200 px-3 rounded focus:bg-white bg-zinc-50 outline-none w-full"
                                        />
                                    </label>
                                    <label className="grid gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                        Telegram
                                        <input
                                            type="text"
                                            value={contactTelegram}
                                            onChange={e => setContactTelegram(e.target.value)}
                                            className="h-10 text-sm font-semibold border border-zinc-200 px-3 rounded focus:bg-white bg-zinc-50 outline-none w-full"
                                        />
                                    </label>
                                    <label className="grid gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider md:col-span-2">
                                        Город
                                        <select
                                            value={contactCity}
                                            onChange={e => setContactCity(e.target.value)}
                                            className="h-10 text-sm font-semibold border border-zinc-200 px-3 rounded focus:bg-white bg-zinc-50 outline-none w-full"
                                        >
                                            <option>Алматы</option>
                                            <option>Астана</option>
                                            <option>Шымкент</option>
                                        </select>
                                    </label>
                                </form>
                            </Card>

                            {/* Delivery channel checkboxes switches */}
                            <Card className="p-5 shadow-sm space-y-4">
                                <div className="border-b border-zinc-100 pb-2 flex justify-between items-center flex-wrap gap-2">
                                    <div>
                                        <h2 className="text-base font-bold text-zinc-900">Каналы уведомлений</h2>
                                        <p className="text-xs text-zinc-500 mt-0.5">Включите один или несколько путей связи для мгновенного получения уведомлений</p>
                                    </div>
                                    <Button onClick={() => showToast('Пробное уведомление отправлено в Telegram')} variant="outline" size="sm" className="h-8 font-semibold bg-white text-zinc-700">
                                        Проверить доставку
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {[
                                        { key: 'email', label: 'Email', icon: '✉', desc: 'Ежедневные отчеты и история цены', meta: contactEmail },
                                        { key: 'telegram', label: 'Telegram', icon: '↗', desc: 'Новые совпадения авто', meta: contactTelegram },
                                        { key: 'push', label: 'Push', icon: '●', desc: 'Оповещения внутри браузера', meta: 'Этот веб-браузер' }
                                    ].map(channel => {
                                        const isChecked = (channels as any)[channel.key];
                                        return (
                                            <div key={channel.key} className={`border rounded-lg p-4 space-y-3 transition-all ${isChecked ? 'border-zinc-950 bg-white ring-1 ring-zinc-950' : 'border-zinc-200 bg-white'}`}>
                                                <div className="flex justify-between items-center">
                                                    <span className="size-8 bg-zinc-100 rounded border border-zinc-200 text-xs font-semibold flex items-center justify-center">{channel.icon}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setChannels({ ...channels, [channel.key]: !isChecked })}
                                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isChecked ? 'bg-zinc-950' : 'bg-zinc-200'}`}
                                                    >
                                                        <span className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${isChecked ? 'translate-x-4' : 'translate-x-0'}`} />
                                                    </button>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-zinc-950">{channel.label}</h4>
                                                    <p className="text-[11px] text-zinc-400 font-medium leading-normal mt-1">{channel.desc}</p>
                                                    <small className="block text-[10px] text-zinc-500 font-bold tracking-wider mt-1">{channel.meta}</small>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>

                            {/* Quiet hours & save details */}
                            <Card className="p-5 shadow-sm space-y-4">
                                <div className="border-b border-zinc-100 pb-2">
                                    <h2 className="text-base font-bold text-zinc-900">Тихие часы</h2>
                                    <p className="text-xs text-zinc-500 mt-0.5">В это время AutoPlace не будет отправлять несрочные уведомления</p>
                                </div>
                                <div className="space-y-4">
                                    <Checkbox
                                        id="quiet-hours-toggle"
                                        checked={quietHoursEnabled}
                                        onChange={() => setQuietHoursEnabled(!quietHoursEnabled)}
                                        icon="⏰"
                                        label="Включить тихие часы (только приоритетные уведомления)"
                                    />

                                    {quietHoursEnabled && (
                                        <div className="grid grid-cols-2 gap-4 max-w-sm">
                                            <label className="grid gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                                С
                                                <input
                                                    type="time"
                                                    value={quietStart}
                                                    onChange={e => setQuietStart(e.target.value)}
                                                    className="h-10 text-sm font-semibold border border-zinc-200 px-3 rounded focus:bg-white bg-zinc-50 outline-none w-full"
                                                />
                                            </label>
                                            <label className="grid gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                                До
                                                <input
                                                    type="time"
                                                    value={quietEnd}
                                                    onChange={e => setQuietEnd(e.target.value)}
                                                    className="h-10 text-sm font-semibold border border-zinc-200 px-3 rounded focus:bg-white bg-zinc-50 outline-none w-full"
                                                />
                                            </label>
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <Button onClick={handleSaveSettings} variant="default" className="h-10 px-5 font-bold">
                                            Сохранить настройки
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                </section>
            </div>

        </AppLayout>
    );
}

function toNotificationItem(notification: AccountNotification, readNotificationIds: Set<string>): NotificationItem {
    const vehicle = notification.vehicle;
    const title = vehicle
        ? `Новое совпадение: ${vehicle.make?.name ?? 'Марка'} ${vehicle.model?.name ?? 'модель'}`
        : 'Новое совпадение по подписке';

    const text = vehicle
        ? [
            `${vehicle.year} год`,
            `${vehicle.mileage.toLocaleString('ru-RU')} км`,
            fuelLabel(vehicle.fuel_type),
            `$${vehicle.price.toLocaleString('ru-RU')}`,
        ].join(' · ')
        : 'Появился автомобиль, который подходит под одну из ваших подписок.';

    return {
        id: notification.id,
        type: 'subscription',
        icon: <Search size={15} />,
        title,
        text,
        time: formatNotificationTime(notification.created_at),
        unread: !notification.read_at && !readNotificationIds.has(notification.id),
    };
}

function fuelLabel(type: string): string {
    return {
        gasoline: 'бензин',
        diesel: 'дизель',
        hybrid: 'гибрид',
        electric: 'электро',
        lpg: 'газ',
    }[type] ?? type;
}

function formatNotificationTime(value: string | null): string {
    if (!value) {
        return 'только что';
    }

    const date = new Date(value);
    const diffSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

    if (diffSeconds < 60) {
        return 'только что';
    }

    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffMinutes < 60) {
        return `${diffMinutes} мин назад`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
        return `${diffHours} ч назад`;
    }

    return date.toLocaleDateString('ru-RU');
}
