<?php

namespace App\Filament\Resources\CatalogVehicles\Pages;

use App\Filament\Resources\CatalogVehicles\CatalogVehicleResource;
use App\Jobs\ProcessVehicleSubscriptions;
use Filament\Resources\Pages\CreateRecord;

class CreateCatalogVehicle extends CreateRecord
{
    protected static string $resource = CatalogVehicleResource::class;

    protected function afterCreate(): void
    {
        ProcessVehicleSubscriptions::dispatch($this->record->id);
    }
}
