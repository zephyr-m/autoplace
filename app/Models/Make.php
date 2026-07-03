<?php

namespace App\Models;

use Database\Factories\MakeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Make extends Model
{
    /** @use HasFactory<MakeFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'status_import',
        'status_app',
    ];

    protected function casts(): array
    {
        return [
            'status_import' => 'integer',
            'status_app' => 'integer',
        ];
    }
}
