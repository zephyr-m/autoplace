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
            $table->string('source_reference')->nullable()->unique();
            $table->unsignedBigInteger('make_id');
            $table->unsignedBigInteger('model_id');
            $table->string('make');
            $table->string('model');
            $table->unsignedInteger('price');
            $table->unsignedInteger('mileage');
            $table->unsignedInteger('power');
            $table->string('fuel_type');
            $table->unsignedSmallInteger('year');
            $table->json('payload')->nullable();
            $table->timestamps();

            $table->index(['make_id', 'model_id']);
            $table->index(['make', 'model']);
            $table->index(['fuel_type', 'year']);
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catalog_vehicles');
    }
};
