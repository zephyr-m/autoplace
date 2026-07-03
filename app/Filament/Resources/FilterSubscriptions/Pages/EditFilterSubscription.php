<?php

namespace App\Filament\Resources\FilterSubscriptions\Pages;

use App\Filament\Resources\FilterSubscriptions\FilterSubscriptionResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFilterSubscription extends EditRecord
{
    protected static string $resource = FilterSubscriptionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
