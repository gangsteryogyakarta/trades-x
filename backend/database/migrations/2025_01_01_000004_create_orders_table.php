<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('stock_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['buy', 'sell']); // Buy or Sell
            $table->enum('status', ['open', 'matched', 'cancelled', 'rejected'])->default('open');
            $table->decimal('price', 15, 2); // Limit price
            $table->integer('quantity'); // Number of lots/shares
            $table->integer('filled_quantity')->default(0);
            $table->timestamp('matched_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
