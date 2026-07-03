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
                    ->required(),
                TextInput::make('status_import')
                    ->required()
                    ->numeric()
                    ->default(1),
                TextInput::make('status_app')
                    ->required()
                    ->numeric()
                    ->default(1),
            ]);
    }
}
