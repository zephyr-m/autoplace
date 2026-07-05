<?php

namespace App\GraphQL\Mutations;

use App\Models\Notification;

class MarkUserNotificationsRead
{
    public function __invoke(null $_, array $args): int
    {
        return Notification::query()
            ->whereNull('read_at')
            ->whereHas('subscription', fn ($query) => $query->where('user_identifier', $args['user_identifier']))
            ->update(['read_at' => now()]);
    }
}
