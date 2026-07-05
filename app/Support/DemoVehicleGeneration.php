<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;

class DemoVehicleGeneration
{
    private const CACHE_KEY = 'demo_vehicle_generation_enabled';

    public static function isEnabled(): bool
    {
        return (bool) Cache::get(self::CACHE_KEY, true);
    }

    public static function enable(): void
    {
        Cache::forever(self::CACHE_KEY, true);
    }

    public static function disable(): void
    {
        Cache::forever(self::CACHE_KEY, false);
    }
}
