<?php

namespace App\Http\Controllers;

use App\Actions\VehicleFilterMatcher;
use App\Models\FilterSubscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Subscriptions', [
            'subscriptions' => FilterSubscription::query()
                ->latest()
                ->get(['id', 'user_identifier', 'filter', 'status', 'created_at']),
            'fuelTypes' => VehicleFilterMatcher::FUEL_TYPES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_identifier' => ['required', 'string', 'max:120'],
            'make' => ['nullable', 'string', 'max:80'],
            'model' => ['nullable', 'string', 'max:80'],
            'make_id' => ['nullable', 'integer', 'min:1'],
            'model_id' => ['nullable', 'integer', 'min:1'],
            'min_price' => ['nullable', 'integer', 'min:0'],
            'max_price' => ['nullable', 'integer', 'gte:min_price'],
            'min_mileage' => ['nullable', 'integer', 'min:0'],
            'max_mileage' => ['nullable', 'integer', 'gte:min_mileage'],
            'min_power' => ['nullable', 'integer', 'min:1'],
            'max_power' => ['nullable', 'integer', 'gte:min_power'],
            'fuel_type' => ['nullable', Rule::in(VehicleFilterMatcher::FUEL_TYPES)],
            'year_from' => ['nullable', 'integer', 'between:1950,'.((int) date('Y') + 1)],
            'year_to' => ['nullable', 'integer', 'gte:year_from'],
        ]);

        FilterSubscription::query()->create([
            'user_identifier' => $validated['user_identifier'],
            'filter' => VehicleFilterMatcher::cleanFilter($validated),
            'status' => FilterSubscription::STATUS_ACTIVE,
        ]);

        return to_route('subscriptions.index')->with('success', 'Подписка создана.');
    }

    public function destroy(FilterSubscription $subscription): RedirectResponse
    {
        $subscription->delete();

        return to_route('subscriptions.index')->with('success', 'Подписка удалена.');
    }
}
