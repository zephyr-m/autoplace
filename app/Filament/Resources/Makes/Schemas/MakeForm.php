<?php

namespace App\Filament\Resources\Makes\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class MakeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Название')
                    ->required(),
                TextInput::make('status_import')
                    ->label('Статус импорта')
                    ->required()
                    ->numeric()
                    ->default(1),
                TextInput::make('status_app')
                    ->label('Статус приложения')
                    ->required()
                    ->numeric()
                    ->default(1),
            ]);
    }
}
