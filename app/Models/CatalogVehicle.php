<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CatalogVehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'source_reference',
        'make_id',
        'model_id',
        'make',
        'model',
        'price',
        'mileage',
        'power',
        'fuel_type',
        'year',
        'payload',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'make_id' => 'integer',
            'model_id' => 'integer',
            'mileage' => 'integer',
            'power' => 'integer',
            'year' => 'integer',
            'payload' => 'array',
        ];
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'vehicle_id');
    }
}
