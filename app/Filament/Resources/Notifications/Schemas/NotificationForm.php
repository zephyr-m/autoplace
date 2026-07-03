<?php

namespace App\Filament\Resources\Notifications\Schemas;

use App\Models\Notification;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class NotificationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('subscription_id')
                    ->label('Подписка')
                    ->relationship('subscription', 'user_identifier')
                    ->searchable()
                    ->preload()
                    ->required(),
                Select::make('vehicle_id')
                    ->label('Автомобиль')
                    ->relationship('vehicle', 'source_reference')
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('type')
                    ->label('Тип')
                    ->required()
                    ->default(Notification::TYPE_VEHICLE_MATCH)
                    ->maxLength(80),
                KeyValue::make('payload')
                    ->label('Payload')
                    ->keyLabel('Ключ')
                    ->valueLabel('Значение')
                    ->required()
                    ->columnSpanFull(),
            ]);
    }
}
