<?php

namespace App\Filament\Resources\FilterSubscriptions\Tables;

use App\Models\FilterSubscription;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class FilterSubscriptionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),
                TextColumn::make('user_identifier')
                    ->label('Пользователь')
                    ->searchable(),
                TextColumn::make('status')
                    ->label('Статус')
                    ->badge()
                    ->formatStateUsing(fn (int $state): string => match ($state) {
                        FilterSubscription::STATUS_ACTIVE => 'Активна',
                        FilterSubscription::STATUS_PAUSED => 'На паузе',
                        default => $state,
                    })
                    ->color(fn (int $state): string => match ($state) {
                        FilterSubscription::STATUS_ACTIVE => 'success',
                        FilterSubscription::STATUS_PAUSED => 'gray',
                        default => 'gray',
                    })
                    ->searchable(),
                TextColumn::make('notifications_count')
                    ->label('Уведомлений')
                    ->counts('notifications')
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
                SelectFilter::make('status')
                    ->label('Статус')
                    ->options([
                        FilterSubscription::STATUS_ACTIVE => 'Активна',
                        FilterSubscription::STATUS_PAUSED => 'На паузе',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
