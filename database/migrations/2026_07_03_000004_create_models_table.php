<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('models', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('make_id')
                ->constrained('makes')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->string('name');
            $table->unsignedTinyInteger('status_app')->default(1)->comment('Статус для клиентов');
            $table->timestamps();

            $table->unique(['make_id', 'name'], 'models_make_id_name_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('models');
    }
};
