<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('restrict');
            $table->decimal('amount', 15, 2);
            $table->string('currency', 3)->default('USD');
            $table->string('description');
            $table->text('notes')->nullable();
            $table->date('expense_date');
            $table->string('payment_method', 50)->default('cash');
            $table->string('location')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->foreignId('recurring_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'expense_date']);
            $table->index(['user_id', 'category_id']);
            $table->index('expense_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
