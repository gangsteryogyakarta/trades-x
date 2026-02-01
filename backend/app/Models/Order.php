<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'stock_id',
        'type',
        'order_type', // market, limit, stop_loss
        'status',
        'price',
        'quantity',
        'filled_quantity',
        'matched_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }
}
