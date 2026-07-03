<?php

namespace App\Models;

use Database\Factories\FilterSubscriptionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FilterSubscription extends Model
{
    /** @use HasFactory<FilterSubscriptionFactory> */
    use HasFactory;

    public const STATUS_ACTIVE = 1;

    public const STATUS_PAUSED = 2;

    protected $fillable = [
        'user_identifier',
        'filter',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'filter' => 'array',
            'status' => 'integer',
        ];
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'subscription_id');
    }
}
