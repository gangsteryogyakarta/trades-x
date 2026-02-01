<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'seller_id',
        'stock_id',
        'order_id',
        'price',
        'quantity',
        'total_amount',
    ];

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }
}
