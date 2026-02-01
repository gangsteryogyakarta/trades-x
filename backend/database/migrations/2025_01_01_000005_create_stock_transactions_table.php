<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_id')->constrained('users');
            $table->foreignId('seller_id')->constrained('users');
            $table->foreignId('stock_id')->constrained();
            $table->foreignId('order_id')->constrained(); // Linked to the initiating order (usually the aggressive one)
            $table->decimal('price', 15, 2);
            $table->integer('quantity');
            $table->decimal('total_amount', 20, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_transactions');
    }
};
