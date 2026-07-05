<?php

namespace App\GraphQL\Mutations;

use App\Actions\VehicleFilterMatcher;
use App\Models\FilterSubscription;
use Illuminate\Validation\ValidationException;

class CreateFilterSubscription
{
    /**
     * @throws ValidationException
     */
    public function __invoke(null $_, array $args): FilterSubscription
    {
        $filter = VehicleFilterMatcher::cleanFilter($args['filter'] ?? []);

        if ($filter === []) {
            throw ValidationException::withMessages([
                'filter' => 'Нельзя создать подписку без параметров фильтра.',
            ]);
        }

        return FilterSubscription::query()->create([
            'user_identifier' => $args['user_identifier'],
            'filter' => $filter,
            'status' => $args['status'],
        ]);
    }
}
