<?php

namespace App\Models;

use Database\Factories\NotificationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    /** @use HasFactory<NotificationFactory> */
    use HasFactory;

    public const TYPE_VEHICLE_MATCH = 'vehicle_matched';

    protected $fillable = [
        'subscription_id',
        'vehicle_id',
        'type',
        'channel',
        'status',
        'payload',
        'sent_at',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'subscription_id' => 'integer',
            'vehicle_id' => 'integer',
            'status' => 'integer',
            'payload' => 'array',
            'sent_at' => 'datetime',
            'read_at' => 'datetime',
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
