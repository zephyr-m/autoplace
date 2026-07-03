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
            $table->unsignedTinyInteger('status')->default(1)->comment('Статус подписки');
            $table->timestamps();

            $table->index('user_identifier', 'filter_subscriptions_user_identifier_index');
            $table->index('status', 'filter_subscriptions_status_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('filter_subscriptions');
    }
};
