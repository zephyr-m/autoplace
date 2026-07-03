<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('filter_subscriptions', function (Blueprint $table): void {
            $table->id();
            $table->string('user_identifier');
            $table->json('filter');
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index(['user_identifier', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('filter_subscriptions');
    }
};
