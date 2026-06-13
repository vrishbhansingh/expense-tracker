<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function daily(Request $request): JsonResponse
    {
        $date = $request->query('date', today()->toDateString());
        $total = Expense::where('user_id', $request->user()->id)
            ->whereDate('expense_date', $date)
            ->sum('amount');

        $byCategory = Expense::where('user_id', $request->user()->id)
            ->whereDate('expense_date', $date)
            ->select('category_id', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id')
            ->with('category:id,name,icon,color')
            ->get();

        return response()->json([
            'date' => $date,
            'total' => (float) $total,
            'by_category' => $byCategory,
        ]);
    }

    public function monthly(Request $request): JsonResponse
    {
        $month = $request->query('month', now()->format('Y-m'));
        $start = Carbon::parse($month . '-01')->startOfMonth();
        $end = $start->copy()->endOfMonth();

        $total = Expense::where('user_id', $request->user()->id)
            ->whereBetween('expense_date', [$start, $end])
            ->sum('amount');

        $daily = Expense::where('user_id', $request->user()->id)
            ->whereBetween('expense_date', [$start, $end])
            ->select(DB::raw('DATE(expense_date) as date'), DB::raw('SUM(amount) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'month' => $month,
            'total' => (float) $total,
            'daily' => $daily,
            'average_per_day' => (float) ($total / max($start->daysInMonth, 1)),
        ]);
    }

    public function yearly(Request $request): JsonResponse
    {
        $year = $request->query('year', now()->year);
        $total = Expense::where('user_id', $request->user()->id)
            ->whereYear('expense_date', $year)
            ->sum('amount');

        $monthly = Expense::where('user_id', $request->user()->id)
            ->whereYear('expense_date', $year)
            ->select(DB::raw('MONTH(expense_date) as month'), DB::raw('SUM(amount) as total'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'year' => $year,
            'total' => (float) $total,
            'monthly' => $monthly,
            'average_per_month' => (float) ($total / 12),
        ]);
    }

    public function categoryBreakdown(Request $request): JsonResponse
    {
        $from = $request->query('from', now()->startOfMonth()->toDateString());
        $to = $request->query('to', now()->endOfMonth()->toDateString());

        $breakdown = Expense::where('user_id', $request->user()->id)
            ->whereBetween('expense_date', [$from, $to])
            ->select(
                'category_id',
                DB::raw('SUM(amount) as total'),
                DB::raw('COUNT(*) as count'),
                DB::raw('AVG(amount) as average')
            )
            ->groupBy('category_id')
            ->with('category:id,name,icon,color')
            ->orderByDesc('total')
            ->get();

        $grandTotal = $breakdown->sum('total');
        $breakdown->each(function ($item) use ($grandTotal) {
            $item->percentage = $grandTotal > 0 ? round(($item->total / $grandTotal) * 100, 2) : 0;
        });

        return response()->json([
            'from' => $from,
            'to' => $to,
            'total' => (float) $grandTotal,
            'breakdown' => $breakdown,
        ]);
    }

    public function trends(Request $request): JsonResponse
    {
        $days = (int) $request->query('days', 30);
        $start = now()->subDays($days)->startOfDay();

        $trends = Expense::where('user_id', $request->user()->id)
            ->where('expense_date', '>=', $start)
            ->select(
                DB::raw('DATE(expense_date) as date'),
                DB::raw('SUM(amount) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'days' => $days,
            'trends' => $trends,
        ]);
    }
}
