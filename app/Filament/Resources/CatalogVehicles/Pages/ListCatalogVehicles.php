<?php

namespace App\Filament\Resources\CatalogVehicles\Pages;

use App\Filament\Resources\CatalogVehicles\CatalogVehicleResource;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Facades\Artisan;

class ListCatalogVehicles extends ListRecords
{
    protected static string $resource = CatalogVehicleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
            Action::make('generateDemoVehicles')
                ->label('Сгенерировать')
                ->icon('heroicon-o-sparkles')
                ->form([
                    TextInput::make('count')
                        ->label('Количество автомобилей')
                        ->required()
                        ->integer()
                        ->minValue(1)
                        ->maxValue(100)
                        ->default(5),
                ])
                ->action(function (array $data): void {
                    $count = max(1, min(100, (int) $data['count']));

                    Artisan::call('demo:add-catalog-vehicle', [
                        '--count' => $count,
                    ]);

                    Notification::make()
                        ->title("Сгенерировано автомобилей: {$count}")
                        ->success()
                        ->send();
                }),
        ];
    }
}
