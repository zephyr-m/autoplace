<?php

namespace App\Filament\Resources\CatalogVehicles\Schemas;

use App\Actions\VehicleFilterMatcher;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CatalogVehicleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('source_reference')
                    ->label('Внешний ID')
                    ->helperText('Идемпотентный идентификатор события из внутренней системы.')
                    ->maxLength(255),
                Select::make('source_id')
                    ->label('Источник')
                    ->relationship('source', 'name')
                    ->required(),
                Select::make('make_id')
                    ->label('Марка')
                    ->relationship('make', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),
                Select::make('model_id')
                    ->label('Модель')
                    ->relationship('model', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),
                TextInput::make('price')
                    ->label('Цена')
                    ->required()
                    ->integer()
                    ->minValue(1)
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('mileage')
                    ->label('Пробег')
                    ->required()
                    ->integer()
                    ->minValue(0)
                    ->suffix('км')
                    ->numeric(),
                TextInput::make('power')
                    ->label('Мощность')
                    ->required()
                    ->integer()
                    ->minValue(1)
                    ->suffix('л.с.')
                    ->numeric(),
                Select::make('fuel_type')
                    ->label('Тип топлива')
                    ->required()
                    ->options(collect(VehicleFilterMatcher::FUEL_TYPES)->mapWithKeys(
                        fn (string $type): array => [$type => match ($type) {
                            'gasoline' => 'Бензин',
                            'diesel' => 'Дизель',
                            'hybrid' => 'Гибрид',
                            'electric' => 'Электро',
                            'lpg' => 'Газ',
                            default => $type,
                        }],
                    )->all()),
                TextInput::make('year')
                    ->label('Год')
                    ->required()
                    ->integer()
                    ->minValue(1950)
                    ->maxValue(((int) date('Y')) + 1)
                    ->numeric(),
                KeyValue::make('raw_payload')
                    ->label('Payload')
                    ->keyLabel('Ключ')
                    ->valueLabel('Значение')
                    ->columnSpanFull(),
            ]);
    }
}
