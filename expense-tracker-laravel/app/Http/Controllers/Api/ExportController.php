<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function csv(Request $request): StreamedResponse
    {
        $filename = 'expenses-' . now()->format('Y-m-d') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($request) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Date', 'Category', 'Description', 'Amount', 'Currency', 'Payment Method', 'Location', 'Notes']);

            Expense::where('user_id', $request->user()->id)
                ->with('category')
                ->orderBy('expense_date', 'desc')
                ->chunk(200, function ($expenses) use ($file) {
                    foreach ($expenses as $e) {
                        fputcsv($file, [
                            $e->expense_date->toDateString(),
                            optional($e->category)->name,
                            $e->description,
                            $e->amount,
                            $e->currency,
                            $e->payment_method,
                            $e->location,
                            $e->notes,
                        ]);
                    }
                });

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
