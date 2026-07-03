<?php

namespace App\Filament\Resources\CatalogVehicles\Pages;

use App\Filament\Resources\CatalogVehicles\CatalogVehicleResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCatalogVehicles extends ListRecords
{
    protected static string $resource = CatalogVehicleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
