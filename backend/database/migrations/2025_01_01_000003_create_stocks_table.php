<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->string('ticker')->unique(); // e.g., BBCA, UNVR
            $table->string('name');
            $table->string('sector')->nullable();
            $table->decimal('last_price', 10, 2)->default(0);
            $table->decimal('previous_close', 10, 2)->default(0);
            $table->decimal('change_percentage', 5, 2)->default(0);
            $table->bigInteger('volume')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
