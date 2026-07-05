<?php

namespace App\GraphQL\Queries;

use App\Models\Notification;
use Illuminate\Support\Collection;

class UserNotifications
{
    public function __invoke(null $_, array $args): Collection
    {
        return Notification::query()
            ->with([
                'subscription:id,user_identifier',
                'vehicle:id,source_reference,make_id,model_id,price,mileage,power,fuel_type,year',
                'vehicle.make:id,name',
                'vehicle.model:id,name',
            ])
            ->whereHas('subscription', fn ($query) => $query->where('user_identifier', $args['user_identifier']))
            ->orderByDesc('id')
            ->limit($args['limit'] ?? 50)
            ->get();
    }
}
