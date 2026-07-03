<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('subscription_id')->constrained('filter_subscriptions')->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained('catalog_vehicles')->cascadeOnDelete();
            $table->string('type');
            $table->json('payload');
            $table->timestamps();

            $table->unique(['subscription_id', 'vehicle_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
