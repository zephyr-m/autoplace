<?php

namespace App\Filament\Resources\CatalogVehicles\Tables;

use App\Actions\VehicleFilterMatcher;
use App\Jobs\ProcessVehicleSubscriptions;
use App\Models\CatalogVehicle;
use App\Models\Make;
use App\Models\VehicleModel;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class CatalogVehiclesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->poll('10s')
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),
                TextColumn::make('source_reference')
                    ->label('Внешний ID')
                    ->searchable(),
                TextColumn::make('make.name')
                    ->label('Марка')
                    ->searchable(),
                TextColumn::make('model.name')
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
                SelectFilter::make('make_id')
                    ->label('Марка')
                    ->options(fn (): array => Make::query()
                        ->orderBy('name')
                        ->pluck('name', 'id')
                        ->all()),
                SelectFilter::make('model_id')
                    ->label('Модель')
                    ->options(fn (): array => VehicleModel::query()
                        ->orderBy('name')
                        ->pluck('name', 'id')
                        ->all()),
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
                Filter::make('price_range')
                    ->label('Цена')
                    ->form([
                        TextInput::make('min_price')->label('Цена от')->numeric(),
                        TextInput::make('max_price')->label('Цена до')->numeric(),
                    ])
                    ->query(fn (Builder $query, array $data): Builder => $query
                        ->when($data['min_price'] ?? null, fn (Builder $query, $value): Builder => $query->where('price', '>=', $value))
                        ->when($data['max_price'] ?? null, fn (Builder $query, $value): Builder => $query->where('price', '<=', $value))),
                Filter::make('mileage_range')
                    ->label('Пробег')
                    ->form([
                        TextInput::make('min_mileage')->label('Пробег от')->numeric(),
                        TextInput::make('max_mileage')->label('Пробег до')->numeric(),
                    ])
                    ->query(fn (Builder $query, array $data): Builder => $query
                        ->when($data['min_mileage'] ?? null, fn (Builder $query, $value): Builder => $query->where('mileage', '>=', $value))
                        ->when($data['max_mileage'] ?? null, fn (Builder $query, $value): Builder => $query->where('mileage', '<=', $value))),
                Filter::make('power_range')
                    ->label('Мощность')
                    ->form([
                        TextInput::make('min_power')->label('Мощность от')->numeric(),
                        TextInput::make('max_power')->label('Мощность до')->numeric(),
                    ])
                    ->query(fn (Builder $query, array $data): Builder => $query
                        ->when($data['min_power'] ?? null, fn (Builder $query, $value): Builder => $query->where('power', '>=', $value))
                        ->when($data['max_power'] ?? null, fn (Builder $query, $value): Builder => $query->where('power', '<=', $value))),
                Filter::make('year_range')
                    ->label('Год выпуска')
                    ->form([
                        TextInput::make('year_from')->label('Год от')->numeric(),
                        TextInput::make('year_to')->label('Год до')->numeric(),
                    ])
                    ->query(fn (Builder $query, array $data): Builder => $query
                        ->when($data['year_from'] ?? null, fn (Builder $query, $value): Builder => $query->where('year', '>=', $value))
                        ->when($data['year_to'] ?? null, fn (Builder $query, $value): Builder => $query->where('year', '<=', $value))),
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
            ])
            ->defaultSort('id', 'desc');
    }
}
