<?php

namespace App\GraphQL\Mutations;

use App\Actions\VehicleFilterMatcher;
use App\Models\FilterSubscription;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

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

        Validator::make($filter, [
            'make_id' => ['sometimes', 'integer', 'exists:makes,id'],
            'make_ids' => ['sometimes', 'array'],
            'make_ids.*' => ['integer', 'exists:makes,id'],
            'model_id' => ['sometimes', 'integer', 'exists:models,id'],
            'model_ids' => ['sometimes', 'array'],
            'model_ids.*' => ['integer', 'exists:models,id'],
            'min_price' => ['sometimes', 'integer', 'min:0'],
            'max_price' => ['sometimes', 'integer', 'min:0', 'gte:min_price'],
            'min_mileage' => ['sometimes', 'integer', 'min:0'],
            'max_mileage' => ['sometimes', 'integer', 'min:0', 'gte:min_mileage'],
            'min_power' => ['sometimes', 'integer', 'min:1'],
            'max_power' => ['sometimes', 'integer', 'min:1', 'gte:min_power'],
            'fuel_type' => ['sometimes', 'string', Rule::in(VehicleFilterMatcher::FUEL_TYPES)],
            'fuel_types' => ['sometimes', 'array'],
            'fuel_types.*' => ['string', Rule::in(VehicleFilterMatcher::FUEL_TYPES)],
            'year_from' => ['sometimes', 'integer', 'between:1950,2035'],
            'year_to' => ['sometimes', 'integer', 'between:1950,2035', 'gte:year_from'],
        ])->validate();

        return FilterSubscription::query()->create([
            'user_identifier' => $args['user_identifier'],
            'filter' => $filter,
            'status' => $args['status'],
        ]);
    }
}
