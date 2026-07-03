<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FilterSubscription extends Model
{
    use HasFactory;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_PAUSED = 'paused';

    protected $fillable = [
        'user_identifier',
        'filter',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'filter' => 'array',
        ];
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'subscription_id');
    }
}
