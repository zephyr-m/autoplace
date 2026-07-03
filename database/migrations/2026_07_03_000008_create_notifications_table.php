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
            $table->foreignId('subscription_id')
                ->constrained('filter_subscriptions')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignId('vehicle_id')
                ->constrained('catalog_vehicles')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->string('type', 32)->default('vehicle_matched');
            $table->string('channel', 32)->nullable();
            $table->unsignedTinyInteger('status')->default(1)->comment('Статус уведомления');
            $table->json('payload')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->unique(['subscription_id', 'vehicle_id', 'type'], 'notifications_subscription_id_vehicle_id_type_unique');
            $table->index('status', 'notifications_status_index');
            $table->index('channel', 'notifications_channel_index');
            $table->index('sent_at', 'notifications_sent_at_index');
            $table->index('read_at', 'notifications_read_at_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
