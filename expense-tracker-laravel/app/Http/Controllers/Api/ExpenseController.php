<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ExpenseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Expense::where('user_id', $request->user()->id)
            ->with('category', 'attachments');

        // Filters
        if ($from = $request->query('from')) {
            $query->whereDate('expense_date', '>=', $from);
        }
        if ($to = $request->query('to')) {
            $query->whereDate('expense_date', '<=', $to);
        }
        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        }
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }
        if ($paymentMethod = $request->query('payment_method')) {
            $query->where('payment_method', $paymentMethod);
        }

        $sortBy = $request->query('sort_by', 'expense_date');
        $sortDir = $request->query('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $perPage = min((int) $request->query('per_page', 25), 100);
        $expenses = $query->paginate($perPage);

        return response()->json($expenses);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'description' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'expense_date' => ['required', 'date'],
            'payment_method' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
            'is_recurring' => ['boolean'],
        ]);

        $data['user_id'] = $request->user()->id;
        $data['currency'] = $data['currency'] ?? $request->user()->currency;
        $data['payment_method'] = $data['payment_method'] ?? 'cash';

        $expense = Expense::create($data);
        $expense->load('category');

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('attachments/' . $expense->id, 'public');
                $expense->attachments()->create([
                    'filename' => basename($path),
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'path' => $path,
                ]);
            }
        }

        return response()->json($expense->load('category', 'attachments'), 201);
    }

    public function show(Request $request, Expense $expense): JsonResponse
    {
        $this->authorizeExpense($request, $expense);
        return response()->json($expense->load('category', 'attachments'));
    }

    public function update(Request $request, Expense $expense): JsonResponse
    {
        $this->authorizeExpense($request, $expense);

        $data = $request->validate([
            'category_id' => ['sometimes', 'exists:categories,id'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'description' => ['sometimes', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'expense_date' => ['sometimes', 'date'],
            'payment_method' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
        ]);

        $expense->update($data);

        return response()->json($expense->load('category', 'attachments'));
    }

    public function destroy(Request $request, Expense $expense): JsonResponse
    {
        $this->authorizeExpense($request, $expense);
        // Delete attachments
        foreach ($expense->attachments as $att) {
            Storage::disk('public')->delete($att->path);
        }
        $expense->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:expenses,id'],
        ]);

        $count = Expense::where('user_id', $request->user()->id)
            ->whereIn('id', $data['ids'])
            ->delete();

        return response()->json(['deleted' => $count]);
    }

    private function authorizeExpense(Request $request, Expense $expense): void
    {
        abort_unless($expense->user_id === $request->user()->id, 403, 'Unauthorized');
    }
}
