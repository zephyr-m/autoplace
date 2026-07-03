<?php

namespace App\Filament\Resources\FilterSubscriptions\Schemas;

use App\Models\FilterSubscription;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class FilterSubscriptionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_identifier')
                    ->label('Пользователь')
                    ->required()
                    ->maxLength(120),
                KeyValue::make('filter')
                    ->label('Фильтр')
                    ->helperText('Ключи: make_id, model_id, min_price, max_price, min_mileage, max_mileage, min_power, max_power, fuel_type, year_from, year_to.')
                    ->keyLabel('Параметр')
                    ->valueLabel('Значение')
                    ->required()
                    ->columnSpanFull(),
                Select::make('status')
                    ->label('Статус')
                    ->required()
                    ->options([
                        FilterSubscription::STATUS_ACTIVE => 'Активна',
                        FilterSubscription::STATUS_PAUSED => 'На паузе',
                    ])
                    ->default(FilterSubscription::STATUS_ACTIVE),
            ]);
    }
}
