<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('catalog_vehicles', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('source_id')
                ->constrained('import_sources')
                ->cascadeOnUpdate()
                ->nullable()
                ->restrictOnDelete();
            $table->string('source_reference');
            $table->foreignId('make_id')
                ->constrained('makes')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->foreignId('model_id')
                ->constrained('models')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->unsignedBigInteger('price');
            $table->unsignedInteger('mileage');
            $table->unsignedSmallInteger('power');
            $table->enum('fuel_type', ['gasoline', 'diesel', 'electric', 'hybrid', 'lpg'])
                ->default('gasoline')
                ->comment('Тип топлива: gasoline, diesel, electric, hybrid, lpg');
            $table->unsignedSmallInteger('year');
            $table->json('raw_payload')->nullable();
            $table->timestamps();

            $table->unique(['source_id', 'source_reference'], 'catalog_vehicles_source_id_source_reference_unique');
            $table->index(['make_id', 'model_id'], 'catalog_vehicles_make_id_model_id_index');
            $table->index('price', 'catalog_vehicles_price_index');
            $table->index('mileage', 'catalog_vehicles_mileage_index');
            $table->index('power', 'catalog_vehicles_power_index');
            $table->index('fuel_type', 'catalog_vehicles_fuel_type_index');
            $table->index('year', 'catalog_vehicles_year_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catalog_vehicles');
    }
};
