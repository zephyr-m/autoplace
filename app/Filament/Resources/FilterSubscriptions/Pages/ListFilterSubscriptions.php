<?php

namespace App\Filament\Resources\FilterSubscriptions\Pages;

use App\Filament\Resources\FilterSubscriptions\FilterSubscriptionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFilterSubscriptions extends ListRecords
{
    protected static string $resource = FilterSubscriptionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
