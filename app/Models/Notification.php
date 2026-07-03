<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    public const TYPE_VEHICLE_MATCH = 'vehicle_match';

    protected $fillable = [
        'subscription_id',
        'vehicle_id',
        'type',
        'payload',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
        ];
    }

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(FilterSubscription::class, 'subscription_id');
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(CatalogVehicle::class, 'vehicle_id');
    }
}
