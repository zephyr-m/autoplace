<?php

namespace App\Filament\Widgets;

use App\Models\CatalogVehicle;
use App\Models\FilterSubscription;
use App\Models\Notification;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AdminStatsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Автомобили', CatalogVehicle::query()->count())
                ->description('Внутренний каталог')
                ->icon('heroicon-o-truck')
                ->color('primary'),
            Stat::make('Активные подписки', FilterSubscription::query()->where('status', FilterSubscription::STATUS_ACTIVE)->count())
                ->description('Проверяются при событиях каталога')
                ->icon('heroicon-o-funnel')
                ->color('success'),
            Stat::make('Уведомления', Notification::query()->count())
                ->description('Созданы идемпотентно')
                ->icon('heroicon-o-bell')
                ->color('info'),
        ];
    }
}
