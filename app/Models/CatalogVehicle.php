<?php

namespace App\Models;

use Database\Factories\CatalogVehicleFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CatalogVehicle extends Model
{
    /** @use HasFactory<CatalogVehicleFactory> */
    use HasFactory;

    protected $fillable = [
        'source_id',
        'source_reference',
        'make_id',
        'model_id',
        'price',
        'mileage',
        'power',
        'fuel_type',
        'year',
        'raw_payload',
    ];

    protected function casts(): array
    {
        return [
            'source_id' => 'integer',
            'make_id' => 'integer',
            'model_id' => 'integer',
            'price' => 'integer',
            'mileage' => 'integer',
            'power' => 'integer',
            'year' => 'integer',
            'raw_payload' => 'array',
        ];
    }

    public function make(): BelongsTo
    {
        return $this->belongsTo(Make::class);
    }

    public function model(): BelongsTo
    {
        return $this->belongsTo(VehicleModel::class, 'model_id');
    }
}
