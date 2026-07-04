<?php

namespace Tests\Feature;

use App\Jobs\ProcessVehicleSubscriptions;
use App\Models\CatalogVehicle;
use App\Models\FilterSubscription;
use App\Models\ImportSource;
use App\Models\Make;
use App\Models\Notification;
use App\Models\VehicleModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_matching_vehicle_creates_notification_once(): void
    {
        [$source, $make, $model] = $this->catalogReferences('Demo Import', 'Toyota', 'Camry');

        $subscription = FilterSubscription::query()->create([
            'user_identifier' => 'demo-user@example.com',
            'filter' => [
                'make_id' => $make->id,
                'model_id' => $model->id,
                'max_price' => 30000,
                'fuel_type' => 'gasoline',
                'year_from' => 2020,
            ],
            'status' => FilterSubscription::STATUS_ACTIVE,
        ]);

        $vehicle = CatalogVehicle::query()->create([
            'source_id' => $source->id,
            'source_reference' => 'test-camry',
            'make_id' => $make->id,
            'model_id' => $model->id,
            'price' => 26000,
            'mileage' => 42000,
            'power' => 203,
            'fuel_type' => 'gasoline',
            'year' => 2021,
        ]);

        ProcessVehicleSubscriptions::dispatchSync($vehicle->id);
        ProcessVehicleSubscriptions::dispatchSync($vehicle->id);

        $this->assertSame(1, Notification::query()->count());
        $this->assertDatabaseHas('notifications', [
            'subscription_id' => $subscription->id,
            'vehicle_id' => $vehicle->id,
            'type' => Notification::TYPE_VEHICLE_MATCH,
        ]);
    }

    public function test_non_matching_vehicle_does_not_create_notification(): void
    {
        [, $toyota] = $this->catalogReferences('Demo Import', 'Toyota', 'Camry');
        [$source, $tesla, $model] = $this->catalogReferences('Demo Import', 'Tesla', 'Model 3');

        FilterSubscription::query()->create([
            'user_identifier' => 'demo-user@example.com',
            'filter' => [
                'make_id' => $toyota->id,
                'max_price' => 30000,
            ],
            'status' => FilterSubscription::STATUS_ACTIVE,
        ]);

        $vehicle = CatalogVehicle::query()->create([
            'source_id' => $source->id,
            'source_reference' => 'test-model-3',
            'make_id' => $tesla->id,
            'model_id' => $model->id,
            'price' => 39000,
            'mileage' => 18000,
            'power' => 283,
            'fuel_type' => 'electric',
            'year' => 2022,
        ]);

        ProcessVehicleSubscriptions::dispatchSync($vehicle->id);

        $this->assertSame(0, Notification::query()->count());
    }

    public function test_http_vehicle_event_is_validated_and_queued_for_matching(): void
    {
        [, $make, $model] = $this->catalogReferences('Demo Import', 'Toyota', 'Camry');

        FilterSubscription::query()->create([
            'user_identifier' => 'demo-user@example.com',
            'filter' => ['model_id' => $model->id],
            'status' => FilterSubscription::STATUS_ACTIVE,
        ]);

        $this->post('/admin/vehicles', [
            'source_reference' => 'http-camry',
            'make_id' => $make->id,
            'model_id' => $model->id,
            'price' => 26000,
            'mileage' => 42000,
            'power' => 203,
            'fuel_type' => 'gasoline',
            'year' => 2021,
        ])->assertRedirect('/');

        $this->assertDatabaseHas('catalog_vehicles', ['source_reference' => 'http-camry']);
        $this->assertSame(1, Notification::query()->count());
    }

    /**
     * @return array{ImportSource, Make, VehicleModel}
     */
    private function catalogReferences(string $sourceName, string $makeName, string $modelName): array
    {
        $source = ImportSource::query()->firstOrCreate(['name' => $sourceName]);
        $make = Make::query()->firstOrCreate(['name' => $makeName]);
        $model = VehicleModel::query()->firstOrCreate([
            'make_id' => $make->id,
            'name' => $modelName,
        ]);

        return [$source, $make, $model];
    }
}
