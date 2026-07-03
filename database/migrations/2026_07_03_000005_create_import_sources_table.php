<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('import_sources', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique('name', 'import_sources_name_unique');
            $table->index('is_active', 'import_sources_is_active_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('import_sources');
    }
};
