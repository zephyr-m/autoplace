<?php

namespace App\Models;

use Database\Factories\VehicleModelFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleModel extends Model
{
    /** @use HasFactory<VehicleModelFactory> */
    use HasFactory;

    protected $table = 'models';

    protected $fillable = [
        'make_id',
        'name',
        'status_app',
    ];

    protected function casts(): array
    {
        return [
            'make_id' => 'integer',
            'status_app' => 'integer',
        ];
    }

    public function make(): BelongsTo
    {
        return $this->belongsTo(Make::class);
    }
}
