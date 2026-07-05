<?php

namespace App\Filament\Resources\VehicleModels\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class VehicleModelForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('make_id')
                    ->label('Марка')
                    ->relationship('make', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),
                TextInput::make('name')
                    ->label('Название')
                    ->required()
                    ->maxLength(255),
                TextInput::make('status_app')
                    ->label('Статус приложения')
                    ->required()
                    ->numeric()
                    ->default(1),
            ]);
    }
}
