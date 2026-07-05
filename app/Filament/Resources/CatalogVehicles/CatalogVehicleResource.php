<?php

namespace App\Filament\Resources\CatalogVehicles;

use App\Filament\Resources\CatalogVehicles\Pages\CreateCatalogVehicle;
use App\Filament\Resources\CatalogVehicles\Pages\EditCatalogVehicle;
use App\Filament\Resources\CatalogVehicles\Pages\ListCatalogVehicles;
use App\Filament\Resources\CatalogVehicles\Schemas\CatalogVehicleForm;
use App\Filament\Resources\CatalogVehicles\Tables\CatalogVehiclesTable;
use App\Models\CatalogVehicle;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class CatalogVehicleResource extends Resource
{
    protected static ?string $model = CatalogVehicle::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTruck;

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'автомобиль';

    protected static ?string $pluralModelLabel = 'Автомобили';

    public static function form(Schema $schema): Schema
    {
        return CatalogVehicleForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CatalogVehiclesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCatalogVehicles::route('/'),
            'create' => CreateCatalogVehicle::route('/create'),
            'edit' => EditCatalogVehicle::route('/{record}/edit'),
        ];
    }
}
