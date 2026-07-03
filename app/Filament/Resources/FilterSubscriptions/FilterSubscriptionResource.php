<?php

namespace App\Filament\Resources\FilterSubscriptions;

use App\Filament\Resources\FilterSubscriptions\Pages\CreateFilterSubscription;
use App\Filament\Resources\FilterSubscriptions\Pages\EditFilterSubscription;
use App\Filament\Resources\FilterSubscriptions\Pages\ListFilterSubscriptions;
use App\Filament\Resources\FilterSubscriptions\Schemas\FilterSubscriptionForm;
use App\Filament\Resources\FilterSubscriptions\Tables\FilterSubscriptionsTable;
use App\Models\FilterSubscription;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class FilterSubscriptionResource extends Resource
{
    protected static ?string $model = FilterSubscription::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedFunnel;

    protected static string|UnitEnum|null $navigationGroup = 'Внешняя система';

    protected static ?string $modelLabel = 'подписка';

    protected static ?string $pluralModelLabel = 'Подписки';

    public static function form(Schema $schema): Schema
    {
        return FilterSubscriptionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FilterSubscriptionsTable::configure($table);
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
            'index' => ListFilterSubscriptions::route('/'),
            'create' => CreateFilterSubscription::route('/create'),
            'edit' => EditFilterSubscription::route('/{record}/edit'),
        ];
    }
}
