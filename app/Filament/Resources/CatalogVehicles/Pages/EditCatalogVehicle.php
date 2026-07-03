<?php

namespace App\Filament\Resources\CatalogVehicles\Pages;

use App\Filament\Resources\CatalogVehicles\CatalogVehicleResource;
use App\Jobs\ProcessVehicleSubscriptions;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCatalogVehicle extends EditRecord
{
    protected static string $resource = CatalogVehicleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function afterSave(): void
    {
        ProcessVehicleSubscriptions::dispatch($this->record->id);
    }
}
