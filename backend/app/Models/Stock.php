<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticker',
        'name',
        'sector',
        'last_price',
        'previous_close',
        'change_percentage',
        'volume',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
