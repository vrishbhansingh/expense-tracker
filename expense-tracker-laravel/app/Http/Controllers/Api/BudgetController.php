<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $budgets = Budget::where('user_id', $request->user()->id)
            ->with('category')
            ->orderByDesc('is_active')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($budgets);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'period' => ['required', 'in:daily,weekly,monthly,yearly'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'alert_threshold' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        $data['user_id'] = $request->user()->id;
        $data['currency'] = $data['currency'] ?? $request->user()->currency;
        $budget = Budget::create($data);

        return response()->json($budget->load('category'), 201);
    }

    public function update(Request $request, Budget $budget): JsonResponse
    {
        abort_unless($budget->user_id === $request->user()->id, 403);
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'period' => ['sometimes', 'in:daily,weekly,monthly,yearly'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['nullable', 'date'],
            'alert_threshold' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'is_active' => ['boolean'],
        ]);
        $budget->update($data);
        return response()->json($budget->load('category'));
    }

    public function destroy(Request $request, Budget $budget): JsonResponse
    {
        abort_unless($budget->user_id === $request->user()->id, 403);
        $budget->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
