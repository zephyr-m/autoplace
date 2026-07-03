<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('makes', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->unsignedTinyInteger('status_import')->default(1)->comment('Статус для импорта');
            $table->unsignedTinyInteger('status_app')->default(1)->comment('Статус для клиентов');
            $table->timestamps();

            $table->unique('name', 'makes_name_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('makes');
    }
};
