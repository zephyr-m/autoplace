<?php

namespace App\Filament\Resources\ImportSources;

use App\Filament\Resources\ImportSources\Pages\CreateImportSource;
use App\Filament\Resources\ImportSources\Pages\EditImportSource;
use App\Filament\Resources\ImportSources\Pages\ListImportSources;
use App\Filament\Resources\ImportSources\Schemas\ImportSourceForm;
use App\Filament\Resources\ImportSources\Tables\ImportSourcesTable;
use App\Models\ImportSource;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ImportSourceResource extends Resource
{
    protected static ?string $model = ImportSource::class;

    protected static bool $shouldRegisterNavigation = false;


    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|UnitEnum|null $navigationGroup = 'Импорт';

    protected static ?string $modelLabel = 'источник импорта';

    protected static ?string $pluralModelLabel = 'Источники импорта';

    public static function form(Schema $schema): Schema
    {
        return ImportSourceForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ImportSourcesTable::configure($table);
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
            'index' => ListImportSources::route('/'),
            'create' => CreateImportSource::route('/create'),
            'edit' => EditImportSource::route('/{record}/edit'),
        ];
    }
}
