<?php

namespace App\Http\Controllers;

use App\Actions\VehicleFilterMatcher;
use App\Jobs\ProcessVehicleSubscriptions;
use App\Models\CatalogVehicle;
use App\Models\ImportSource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CatalogVehicleController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => CatalogVehicle::query()
                ->with(['make:id,name', 'model:id,name'])
                ->latest()
                ->get()
                ->map(fn (CatalogVehicle $vehicle) => [
                    'id' => $vehicle->id,
                    'source_reference' => $vehicle->source_reference,
                    'make_id' => $vehicle->make_id,
                    'model_id' => $vehicle->model_id,
                    'make' => $vehicle->make?->name,
                    'model' => $vehicle->model?->name,
                    'price' => $vehicle->price,
                    'mileage' => $vehicle->mileage,
                    'power' => $vehicle->power,
                    'fuel_type' => $vehicle->fuel_type,
                    'year' => $vehicle->year,
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $vehicle = $this->persistVehicle($this->validateVehicle($request));

        ProcessVehicleSubscriptions::dispatch($vehicle->id);

        return to_route('home')->with('success', 'Автомобиль сохранён, проверка подписок поставлена в очередь.');
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
            'source_id' => ['nullable', 'integer', 'exists:import_sources,id'],
            'source_reference' => ['nullable', 'string', 'max:255'],
            'make_id' => ['required', 'integer', 'exists:makes,id'],
            'model_id' => ['required', 'integer', 'exists:models,id'],
            'price' => ['required', 'integer', 'min:1'],
            'mileage' => ['required', 'integer', 'min:0'],
            'power' => ['required', 'integer', 'min:1'],
            'fuel_type' => ['required', Rule::in(VehicleFilterMatcher::FUEL_TYPES)],
            'year' => ['required', 'integer', 'between:1950,'.((int) date('Y') + 1)],
        ]);
    }

    private function persistVehicle(array $validated): CatalogVehicle
    {
        $sourceId = $validated['source_id'] ?? $this->defaultImportSource()->id;
        $sourceReference = $validated['source_reference'] ?? 'back-office-'.Str::uuid()->toString();
        unset($validated['source_id'], $validated['source_reference']);

        $attributes = $validated + [
            'source_id' => $sourceId,
            'source_reference' => $sourceReference,
            'raw_payload' => ['created_from' => 'back-office'],
        ];

        return CatalogVehicle::query()->updateOrCreate(
            ['source_id' => $sourceId, 'source_reference' => $sourceReference],
            $attributes,
        );
    }

    private function defaultImportSource(): ImportSource
    {
        return ImportSource::query()->firstOrCreate(['name' => 'Back Office Demo']);
    }
}
