<?php

namespace Tests\Feature;

use App\Models\Make;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GraphQLMakeQueryTest extends TestCase
{
    use RefreshDatabase;

    private const FILTER_OPTIONS_PAGE_SIZE = 100;

    public function test_makes_query_returns_make_list_for_filters(): void
    {
        Make::query()->create(['name' => 'Toyota', 'status_import' => 1, 'status_app' => 1]);
        Make::query()->create(['name' => 'BMW', 'status_import' => 1, 'status_app' => 1]);
        Make::query()->create(['name' => 'Tesla', 'status_import' => 1, 'status_app' => 1]);

        $this->postJson('/graphql', [
            'query' => <<<'GRAPHQL'
                query ($first: Int!) {
                  makes(first: $first) {
                    data {
                      id
                      name
                    }
                  }
                }
                GRAPHQL,
            'variables' => ['first' => self::FILTER_OPTIONS_PAGE_SIZE],
        ])
            ->assertOk()
            ->assertJsonMissingPath('errors')
            ->assertJsonPath('data.makes.data.0.name', 'Toyota')
            ->assertJsonPath('data.makes.data.1.name', 'BMW')
            ->assertJsonPath('data.makes.data.2.name', 'Tesla');
    }

    public function test_make_query_returns_single_make_by_required_id(): void
    {
        $make = Make::query()->create(['name' => 'Toyota', 'status_import' => 1, 'status_app' => 1]);
        Make::query()->create(['name' => 'BMW', 'status_import' => 1, 'status_app' => 1]);

        $this->postJson('/graphql', [
            'query' => <<<'GRAPHQL'
                query ($id: ID!) {
                  make(id: $id) {
                    id
                    name
                  }
                }
                GRAPHQL,
            'variables' => ['id' => (string) $make->id],
        ])
            ->assertOk()
            ->assertJsonMissingPath('errors')
            ->assertJsonPath('data.make.id', (string) $make->id)
            ->assertJsonPath('data.make.name', 'Toyota');
    }

    public function test_make_query_without_id_fails_validation_instead_of_returning_multiple_rows(): void
    {
        Make::query()->create(['name' => 'Toyota', 'status_import' => 1, 'status_app' => 1]);
        Make::query()->create(['name' => 'BMW', 'status_import' => 1, 'status_app' => 1]);

        $this->postJson('/graphql', [
            'query' => <<<'GRAPHQL'
                query {
                  make {
                    id
                    name
                  }
                }
                GRAPHQL,
        ])
            ->assertOk()
            ->assertJsonPath('errors.0.message', 'Field "make" argument "id" of type "ID!" is required but not provided.');
    }
}
