<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            ['name' => 'Food & Dining', 'icon' => 'restaurant', 'color' => '#EF4444', 'is_default' => true],
            ['name' => 'Transportation', 'icon' => 'car', 'color' => '#3B82F6', 'is_default' => true],
            ['name' => 'Shopping', 'icon' => 'shopping_bag', 'color' => '#F59E0B', 'is_default' => true],
            ['name' => 'Entertainment', 'icon' => 'movie', 'color' => '#8B5CF6', 'is_default' => true],
            ['name' => 'Bills & Utilities', 'icon' => 'receipt', 'color' => '#10B981', 'is_default' => true],
            ['name' => 'Healthcare', 'icon' => 'medical', 'color' => '#EC4899', 'is_default' => true],
            ['name' => 'Education', 'icon' => 'school', 'color' => '#6366F1', 'is_default' => true],
            ['name' => 'Travel', 'icon' => 'flight', 'color' => '#14B8A6', 'is_default' => true],
            ['name' => 'Other', 'icon' => 'category', 'color' => '#6B7280', 'is_default' => true],
        ];

        foreach ($defaults as $cat) {
            Category::firstOrCreate(['name' => $cat['name'], 'user_id' => null], $cat);
        }
    }
}
