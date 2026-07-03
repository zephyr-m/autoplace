<?php

namespace App\Http\Controllers;

use App\Actions\VehicleFilterMatcher;
use App\Jobs\ProcessVehicleSubscriptions;
use App\Models\CatalogVehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CatalogVehicleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('AdminVehicles', [
            'vehicles' => CatalogVehicle::query()
                ->latest()
                ->paginate(10)
                ->through(fn (CatalogVehicle $vehicle) => [
                    'id' => $vehicle->id,
                    'source_reference' => $vehicle->source_reference,
                    'make_id' => $vehicle->make_id,
                    'model_id' => $vehicle->model_id,
                    'make' => $vehicle->make,
                    'model' => $vehicle->model,
                    'price' => $vehicle->price,
                    'mileage' => $vehicle->mileage,
                    'power' => $vehicle->power,
                    'fuel_type' => $vehicle->fuel_type,
                    'year' => $vehicle->year,
                ]),
            'fuelTypes' => VehicleFilterMatcher::FUEL_TYPES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $vehicle = $this->persistVehicle($this->validateVehicle($request));

        ProcessVehicleSubscriptions::dispatch($vehicle->id);

        return to_route('admin.vehicles.index')->with('success', 'Автомобиль сохранён, проверка подписок поставлена в очередь.');
    }

    public function storeApi(Request $request): JsonResponse
    {
        $vehicle = $this->persistVehicle($this->validateVehicle($request));

        ProcessVehicleSubscriptions::dispatch($vehicle->id);

        return response()->json([
            'data' => [
                'id' => $vehicle->id,
                'source_reference' => $vehicle->source_reference,
            ],
            'message' => 'Автомобиль сохранён, проверка подписок поставлена в очередь.',
        ], 202);
    }

    private function validateVehicle(Request $request): array
    {
        return $request->validate([
            'source_reference' => ['nullable', 'string', 'max:255'],
            'make_id' => ['required', 'integer', 'min:1'],
            'model_id' => ['required', 'integer', 'min:1'],
            'make' => ['required', 'string', 'max:80'],
            'model' => ['required', 'string', 'max:80'],
            'price' => ['required', 'integer', 'min:1'],
            'mileage' => ['required', 'integer', 'min:0'],
            'power' => ['required', 'integer', 'min:1'],
            'fuel_type' => ['required', Rule::in(VehicleFilterMatcher::FUEL_TYPES)],
            'year' => ['required', 'integer', 'between:1950,'.((int) date('Y') + 1)],
        ]);
    }

    private function persistVehicle(array $validated): CatalogVehicle
    {
        $attributes = $validated + ['payload' => ['created_from' => 'back-office']];
        $sourceReference = $validated['source_reference'] ?? null;

        return $sourceReference
            ? CatalogVehicle::query()->updateOrCreate(['source_reference' => $sourceReference], $attributes)
            : CatalogVehicle::query()->create($attributes);
    }
}
