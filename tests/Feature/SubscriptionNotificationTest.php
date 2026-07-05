<?php

namespace Tests\Feature;

use App\Jobs\ProcessVehicleSubscriptions;
use App\Models\CatalogVehicle;
use App\Models\FilterSubscription;
use App\Models\ImportSource;
use App\Models\Make;
use App\Models\Notification;
use App\Models\VehicleModel;
use App\Support\DemoVehicleGeneration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SubscriptionNotificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('services.vehicle_matching.force_match', false);
        DemoVehicleGeneration::enable();
    }

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

    public function test_multiple_matching_vehicles_create_multiple_notifications(): void
    {
        [$source, $make, $model] = $this->catalogReferences('Demo Import', 'Toyota', 'Camry');
        $subscription = FilterSubscription::query()->create([
            'user_identifier' => 'demo-user@example.com',
            'filter' => [
                'make_id' => $make->id,
                'model_id' => $model->id,
            ],
            'status' => FilterSubscription::STATUS_ACTIVE,
        ]);

        $vehicles = collect([
            ['source_reference' => 'bulk-camry-1', 'price' => 26000, 'mileage' => 42000, 'power' => 203, 'fuel_type' => 'gasoline', 'year' => 2021],
            ['source_reference' => 'bulk-camry-2', 'price' => 33500, 'mileage' => 68000, 'power' => 219, 'fuel_type' => 'hybrid', 'year' => 2020],
            ['source_reference' => 'bulk-camry-3', 'price' => 18000, 'mileage' => 140000, 'power' => 181, 'fuel_type' => 'gasoline', 'year' => 2016],
            ['source_reference' => 'bulk-camry-4', 'price' => 52000, 'mileage' => 12000, 'power' => 225, 'fuel_type' => 'hybrid', 'year' => 2025],
        ])->map(fn (array $attributes) => CatalogVehicle::query()->create($attributes + [
            'source_id' => $source->id,
            'make_id' => $make->id,
            'model_id' => $model->id,
        ]));

        $vehicles->each(fn (CatalogVehicle $vehicle) => ProcessVehicleSubscriptions::dispatchSync($vehicle->id));

        $this->assertSame(4, Notification::query()
            ->where('subscription_id', $subscription->id)
            ->count());
    }

    public function test_notification_uniqueness_is_enforced_by_database(): void
    {
        [$source, $make, $model] = $this->catalogReferences('Demo Import', 'Toyota', 'Camry');
        $subscription = FilterSubscription::query()->create([
            'user_identifier' => 'demo-user@example.com',
            'filter' => ['make_id' => $make->id],
            'status' => FilterSubscription::STATUS_ACTIVE,
        ]);
        $vehicle = CatalogVehicle::query()->create([
            'source_id' => $source->id,
            'source_reference' => 'unique-notification-camry',
            'make_id' => $make->id,
            'model_id' => $model->id,
            'price' => 26000,
            'mileage' => 42000,
            'power' => 203,
            'fuel_type' => 'gasoline',
            'year' => 2021,
        ]);

        Notification::query()->create([
            'subscription_id' => $subscription->id,
            'vehicle_id' => $vehicle->id,
            'type' => Notification::TYPE_VEHICLE_MATCH,
        ]);

        $this->expectException(QueryException::class);

        Notification::query()->create([
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

    public function test_force_match_flag_creates_notification_for_non_matching_vehicle(): void
    {
        Config::set('services.vehicle_matching.force_match', true);

        [, $toyota] = $this->catalogReferences('Demo Import', 'Toyota', 'Camry');
        [$source, $tesla, $model] = $this->catalogReferences('Demo Import', 'Tesla', 'Model 3');

        $subscription = FilterSubscription::query()->create([
            'user_identifier' => 'demo-user@example.com',
            'filter' => [
                'make_id' => $toyota->id,
                'max_price' => 30000,
            ],
            'status' => FilterSubscription::STATUS_ACTIVE,
        ]);

        $vehicle = CatalogVehicle::query()->create([
            'source_id' => $source->id,
            'source_reference' => 'force-match-model-3',
            'make_id' => $tesla->id,
            'model_id' => $model->id,
            'price' => 39000,
            'mileage' => 18000,
            'power' => 283,
            'fuel_type' => 'electric',
            'year' => 2022,
        ]);

        ProcessVehicleSubscriptions::dispatchSync($vehicle->id);

        $this->assertDatabaseHas('notifications', [
            'subscription_id' => $subscription->id,
            'vehicle_id' => $vehicle->id,
            'type' => Notification::TYPE_VEHICLE_MATCH,
        ]);
    }

    public function test_http_vehicle_event_is_validated_and_queued_for_matching(): void
    {
        Queue::fake();

        [, $make, $model] = $this->catalogReferences('Demo Import', 'Toyota', 'Camry');
        $csrfToken = 'test-csrf-token';

        FilterSubscription::query()->create([
            'user_identifier' => 'demo-user@example.com',
            'filter' => ['model_id' => $model->id],
            'status' => FilterSubscription::STATUS_ACTIVE,
        ]);

        $this->withSession(['_token' => $csrfToken])->post('/admin/vehicles', [
            '_token' => $csrfToken,
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
        Queue::assertPushed(ProcessVehicleSubscriptions::class);
    }

    public function test_demo_catalog_vehicle_command_queues_subscription_matching(): void
    {
        Queue::fake();

        $this->artisan('demo:add-catalog-vehicle', ['--count' => 1])
            ->assertSuccessful();

        $this->assertDatabaseCount('catalog_vehicles', 1);
        Queue::assertPushed(ProcessVehicleSubscriptions::class, 1);
    }

    public function test_disabled_demo_generation_does_not_create_vehicle_or_queue_matching(): void
    {
        Queue::fake();
        DemoVehicleGeneration::disable();

        $this->artisan('demo:add-catalog-vehicle', ['--count' => 1])
            ->assertSuccessful();

        $this->assertDatabaseCount('catalog_vehicles', 0);
        Queue::assertNotPushed(ProcessVehicleSubscriptions::class);
    }

    public function test_user_notifications_query_returns_user_notifications_newest_first(): void
    {
        [$source, $make, $model] = $this->catalogReferences('Demo Import', 'Toyota', 'Camry');
        $ownSubscription = FilterSubscription::query()->create([
            'user_identifier' => 'demo-user@example.com',
            'filter' => ['make_id' => $make->id],
            'status' => FilterSubscription::STATUS_ACTIVE,
        ]);
        $otherSubscription = FilterSubscription::query()->create([
            'user_identifier' => 'other-user@example.com',
            'filter' => ['make_id' => $make->id],
            'status' => FilterSubscription::STATUS_ACTIVE,
        ]);
        $olderVehicle = CatalogVehicle::query()->create([
            'source_id' => $source->id,
            'source_reference' => 'graphql-notification-camry-older',
            'make_id' => $make->id,
            'model_id' => $model->id,
            'price' => 26000,
            'mileage' => 42000,
            'power' => 203,
            'fuel_type' => 'gasoline',
            'year' => 2021,
        ]);
        $newerVehicle = CatalogVehicle::query()->create([
            'source_id' => $source->id,
            'source_reference' => 'graphql-notification-camry-newer',
            'make_id' => $make->id,
            'model_id' => $model->id,
            'price' => 26000,
            'mileage' => 42000,
            'power' => 203,
            'fuel_type' => 'gasoline',
            'year' => 2021,
        ]);

        $older = Notification::query()->create([
            'subscription_id' => $ownSubscription->id,
            'vehicle_id' => $olderVehicle->id,
            'type' => Notification::TYPE_VEHICLE_MATCH,
        ]);
        $newer = Notification::query()->create([
            'subscription_id' => $ownSubscription->id,
            'vehicle_id' => $newerVehicle->id,
            'type' => Notification::TYPE_VEHICLE_MATCH,
        ]);
        $older->forceFill([
            'created_at' => now()->subMinute(),
            'updated_at' => now()->subMinute(),
        ])->save();
        $newer->forceFill([
            'created_at' => now(),
            'updated_at' => now(),
        ])->save();
        Notification::query()->create([
            'subscription_id' => $otherSubscription->id,
            'vehicle_id' => $olderVehicle->id,
            'type' => Notification::TYPE_VEHICLE_MATCH,
        ]);

        $this->postJson('/graphql', [
            'query' => <<<'GRAPHQL'
                query ($userIdentifier: String!) {
                  user_notifications(user_identifier: $userIdentifier) {
                    id
                    subscription {
                      user_identifier
                    }
                    vehicle {
                      make {
                        name
                      }
                    }
                  }
                }
                GRAPHQL,
            'variables' => ['userIdentifier' => 'demo-user@example.com'],
        ])
            ->assertOk()
            ->assertJsonMissingPath('errors')
            ->assertJsonCount(2, 'data.user_notifications')
            ->assertJsonPath('data.user_notifications.0.id', (string) $newer->id)
            ->assertJsonPath('data.user_notifications.1.id', (string) $older->id)
            ->assertJsonPath('data.user_notifications.0.subscription.user_identifier', 'demo-user@example.com')
            ->assertJsonPath('data.user_notifications.0.vehicle.make.name', 'Toyota');
    }

    public function test_mark_user_notifications_read_updates_only_user_notifications(): void
    {
        [$source, $make, $model] = $this->catalogReferences('Demo Import', 'Toyota', 'Camry');
        $ownSubscription = FilterSubscription::query()->create([
            'user_identifier' => 'demo-user@example.com',
            'filter' => ['make_id' => $make->id],
            'status' => FilterSubscription::STATUS_ACTIVE,
        ]);
        $otherSubscription = FilterSubscription::query()->create([
            'user_identifier' => 'other-user@example.com',
            'filter' => ['make_id' => $make->id],
            'status' => FilterSubscription::STATUS_ACTIVE,
        ]);
        $vehicle = CatalogVehicle::query()->create([
            'source_id' => $source->id,
            'source_reference' => 'mark-read-camry',
            'make_id' => $make->id,
            'model_id' => $model->id,
            'price' => 26000,
            'mileage' => 42000,
            'power' => 203,
            'fuel_type' => 'gasoline',
            'year' => 2021,
        ]);
        $ownNotification = Notification::query()->create([
            'subscription_id' => $ownSubscription->id,
            'vehicle_id' => $vehicle->id,
            'type' => Notification::TYPE_VEHICLE_MATCH,
        ]);
        $otherNotification = Notification::query()->create([
            'subscription_id' => $otherSubscription->id,
            'vehicle_id' => $vehicle->id,
            'type' => Notification::TYPE_VEHICLE_MATCH,
        ]);

        $this->postJson('/graphql', [
            'query' => <<<'GRAPHQL'
                mutation ($userIdentifier: String!) {
                  markUserNotificationsRead(user_identifier: $userIdentifier)
                }
                GRAPHQL,
            'variables' => ['userIdentifier' => 'demo-user@example.com'],
        ])
            ->assertOk()
            ->assertJsonMissingPath('errors')
            ->assertJsonPath('data.markUserNotificationsRead', 1);

        $this->assertNotNull($ownNotification->refresh()->read_at);
        $this->assertNull($otherNotification->refresh()->read_at);
    }

    public function test_create_filter_subscription_rejects_empty_filter(): void
    {
        $this->postJson('/graphql', [
            'query' => <<<'GRAPHQL'
                mutation ($filter: JSON!) {
                  createFilterSubscription(user_identifier: "demo-user@example.com", filter: $filter, status: 1) {
                    id
                  }
                }
                GRAPHQL,
            'variables' => ['filter' => []],
        ])
            ->assertOk()
            ->assertJsonPath('errors.0.message', 'Нельзя создать подписку без параметров фильтра.');

        $this->assertDatabaseCount('filter_subscriptions', 0);
    }

    public function test_create_filter_subscription_validates_filter_values(): void
    {
        [, $make, $model] = $this->catalogReferences('Demo Import', 'Toyota', 'Camry');

        $this->postJson('/graphql', [
            'query' => <<<'GRAPHQL'
                mutation ($filter: JSON!) {
                  createFilterSubscription(user_identifier: "demo-user@example.com", filter: $filter, status: 1) {
                    id
                  }
                }
                GRAPHQL,
            'variables' => [
                'filter' => [
                    'make_id' => $make->id,
                    'model_id' => $model->id,
                    'max_price' => 'cheap',
                    'fuel_type' => 'steam',
                    'year_from' => 2025,
                    'year_to' => 2020,
                ],
            ],
        ])
            ->assertOk()
            ->assertJsonPath('errors.0.extensions.validation.max_price.0', 'validation.integer')
            ->assertJsonPath('errors.0.extensions.validation.fuel_type.0', 'validation.in')
            ->assertJsonPath('errors.0.extensions.validation.year_to.0', 'validation.gte.numeric');

        $this->assertDatabaseCount('filter_subscriptions', 0);
    }

    public function test_create_filter_subscription_accepts_valid_typed_filter(): void
    {
        [, $make, $model] = $this->catalogReferences('Demo Import', 'Toyota', 'Camry');

        $this->postJson('/graphql', [
            'query' => <<<'GRAPHQL'
                mutation ($filter: JSON!) {
                  createFilterSubscription(user_identifier: "demo-user@example.com", filter: $filter, status: 1) {
                    filter
                  }
                }
                GRAPHQL,
            'variables' => [
                'filter' => [
                    'make_id' => $make->id,
                    'model_id' => $model->id,
                    'min_price' => 20000,
                    'max_price' => 30000,
                    'min_mileage' => 0,
                    'max_mileage' => 80000,
                    'min_power' => 150,
                    'max_power' => 250,
                    'fuel_type' => 'gasoline',
                    'year_from' => 2020,
                    'year_to' => 2024,
                ],
            ],
        ])
            ->assertOk()
            ->assertJsonMissingPath('errors')
            ->assertJsonPath('data.createFilterSubscription.filter.max_power', 250);

        $this->assertDatabaseCount('filter_subscriptions', 1);
    }

    public function test_created_tesla_subscription_filter_is_used_for_matching(): void
    {
        [$source, $tesla, $teslaModel] = $this->catalogReferences('Demo Import', 'Tesla', 'Model 3');
        [, $bmw, $bmwModel] = $this->catalogReferences('Demo Import', 'BMW', 'X5');

        $this->postJson('/graphql', [
            'query' => <<<'GRAPHQL'
                mutation ($filter: JSON!) {
                  createFilterSubscription(user_identifier: "demo-user@example.com", filter: $filter, status: 1) {
                    id
                    filter
                  }
                }
                GRAPHQL,
            'variables' => ['filter' => ['make_ids' => [$tesla->id]]],
        ])
            ->assertOk()
            ->assertJsonMissingPath('errors')
            ->assertJsonPath('data.createFilterSubscription.filter.make_ids.0', $tesla->id);

        $subscription = FilterSubscription::query()->firstOrFail();
        $teslaVehicle = CatalogVehicle::query()->create([
            'source_id' => $source->id,
            'source_reference' => 'tesla-subscription-match',
            'make_id' => $tesla->id,
            'model_id' => $teslaModel->id,
            'price' => 39000,
            'mileage' => 18000,
            'power' => 283,
            'fuel_type' => 'electric',
            'year' => 2022,
        ]);
        $bmwVehicle = CatalogVehicle::query()->create([
            'source_id' => $source->id,
            'source_reference' => 'tesla-subscription-miss',
            'make_id' => $bmw->id,
            'model_id' => $bmwModel->id,
            'price' => 39000,
            'mileage' => 18000,
            'power' => 283,
            'fuel_type' => 'gasoline',
            'year' => 2022,
        ]);

        ProcessVehicleSubscriptions::dispatchSync($teslaVehicle->id);
        ProcessVehicleSubscriptions::dispatchSync($bmwVehicle->id);

        $this->assertDatabaseHas('notifications', [
            'subscription_id' => $subscription->id,
            'vehicle_id' => $teslaVehicle->id,
            'type' => Notification::TYPE_VEHICLE_MATCH,
        ]);
        $this->assertDatabaseMissing('notifications', [
            'subscription_id' => $subscription->id,
            'vehicle_id' => $bmwVehicle->id,
            'type' => Notification::TYPE_VEHICLE_MATCH,
        ]);
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
