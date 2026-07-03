<?php

namespace App\Filament\Resources\CatalogVehicles\Tables;

use App\Actions\VehicleFilterMatcher;
use App\Jobs\ProcessVehicleSubscriptions;
use App\Models\CatalogVehicle;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class CatalogVehiclesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('source_reference')
                    ->label('Внешний ID')
                    ->searchable(),
                TextColumn::make('make_id')
                    ->label('ID марки')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('model_id')
                    ->label('ID модели')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('make')
                    ->label('Марка')
                    ->searchable(),
                TextColumn::make('model')
                    ->label('Модель')
                    ->searchable(),
                TextColumn::make('price')
                    ->label('Цена')
                    ->money('USD')
                    ->sortable(),
                TextColumn::make('mileage')
                    ->label('Пробег')
                    ->numeric()
                    ->suffix(' км')
                    ->sortable(),
                TextColumn::make('power')
                    ->label('Мощность')
                    ->numeric()
                    ->suffix(' л.с.')
                    ->sortable(),
                TextColumn::make('fuel_type')
                    ->label('Топливо')
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'gasoline' => 'Бензин',
                        'diesel' => 'Дизель',
                        'hybrid' => 'Гибрид',
                        'electric' => 'Электро',
                        'lpg' => 'Газ',
                        default => $state,
                    })
                    ->searchable(),
                TextColumn::make('year')
                    ->label('Год')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->label('Создано')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->label('Обновлено')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('fuel_type')
                    ->label('Топливо')
                    ->options(collect(VehicleFilterMatcher::FUEL_TYPES)->mapWithKeys(
                        fn (string $type): array => [$type => match ($type) {
                            'gasoline' => 'Бензин',
                            'diesel' => 'Дизель',
                            'hybrid' => 'Гибрид',
                            'electric' => 'Электро',
                            'lpg' => 'Газ',
                            default => $type,
                        }],
                    )->all()),
                SelectFilter::make('year')
                    ->label('Год')
                    ->options(fn (): array => CatalogVehicle::query()
                        ->distinct()
                        ->orderByDesc('year')
                        ->pluck('year', 'year')
                        ->all()),
            ])
            ->recordActions([
                Action::make('processSubscriptions')
                    ->label('Обработать подписки')
                    ->icon('heroicon-o-bolt')
                    ->requiresConfirmation()
                    ->action(function (CatalogVehicle $record): void {
                        ProcessVehicleSubscriptions::dispatch($record->id);

                        Notification::make()
                            ->title('Обработка подписок поставлена в очередь')
                            ->success()
                            ->send();
                    }),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
