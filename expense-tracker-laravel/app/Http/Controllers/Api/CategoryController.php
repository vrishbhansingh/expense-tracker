<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categories = Category::where(function ($q) use ($request) {
            $q->where('user_id', $request->user()->id)
              ->orWhere('is_default', true);
        })->orderBy('name')->get();

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'icon' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:7'],
        ]);

        $data['user_id'] = $request->user()->id;
        $category = Category::create($data);

        return response()->json($category, 201);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        abort_unless($category->user_id === $request->user()->id, 403);
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'icon' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:7'],
        ]);
        $category->update($data);
        return response()->json($category);
    }

    public function destroy(Request $request, Category $category): JsonResponse
    {
        abort_unless($category->user_id === $request->user()->id, 403);
        $category->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
