<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;

class StockController extends Controller
{
    /**
     * List all available stocks (with optional search)
     */
    public function index(Request $request)
    {
        $query = Stock::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('symbol', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%");
            });
        }

        if ($request->has('sector')) {
            $query->where('sector', $request->sector);
        }

        $stocks = $query->orderBy('symbol')->paginate(50);

        return response()->json($stocks);
    }

    /**
     * Get a specific stock with latest price data
     */
    public function show(Stock $stock)
    {
        // In a real app, we'd fetch live price from an external API
        // For now, simulate with mock data
        $mockPriceData = [
            'current_price' => $stock->last_price ?? rand(1000, 50000),
            'change_percent' => round((rand(-500, 500) / 100), 2),
            'volume' => rand(100000, 10000000),
            'high_24h' => $stock->last_price * 1.05,
            'low_24h' => $stock->last_price * 0.95,
        ];

        return response()->json([
            'stock' => $stock,
            'price_data' => $mockPriceData,
        ]);
    }

    /**
     * Get historical OHLCV data (mock)
     */
    public function history(Request $request, Stock $stock)
    {
        $request->validate([
            'interval' => 'sometimes|in:1m,5m,15m,1h,1d',
            'limit' => 'sometimes|integer|min:10|max:500',
        ]);

        $interval = $request->interval ?? '1d';
        $limit = $request->limit ?? 100;

        // Generate mock OHLCV data
        $data = [];
        $basePrice = $stock->last_price ?? 10000;
        $time = now()->subDays($limit);

        for ($i = 0; $i < $limit; $i++) {
            $open = $basePrice + rand(-500, 500);
            $close = $open + rand(-300, 300);
            $high = max($open, $close) + rand(0, 200);
            $low = min($open, $close) - rand(0, 200);

            $data[] = [
                'time' => $time->copy()->addDays($i)->timestamp,
                'open' => round($open, 2),
                'high' => round($high, 2),
                'low' => round($low, 2),
                'close' => round($close, 2),
                'volume' => rand(10000, 1000000),
            ];

            $basePrice = $close;
        }

        return response()->json([
            'symbol' => $stock->symbol,
            'interval' => $interval,
            'data' => $data,
        ]);
    }

    /**
     * Get market summary (top gainers, losers, volume)
     */
    public function marketSummary()
    {
        // Mock data for market summary
        $stocks = Stock::inRandomOrder()->take(10)->get();

        return response()->json([
            'top_gainers' => $stocks->take(3)->map(fn($s) => [
                'symbol' => $s->symbol,
                'name' => $s->name,
                'change_percent' => round(rand(100, 500) / 100, 2),
            ]),
            'top_losers' => $stocks->skip(3)->take(3)->map(fn($s) => [
                'symbol' => $s->symbol,
                'name' => $s->name,
                'change_percent' => -round(rand(100, 500) / 100, 2),
            ]),
            'most_active' => $stocks->skip(6)->take(4)->map(fn($s) => [
                'symbol' => $s->symbol,
                'name' => $s->name,
                'volume' => rand(1000000, 50000000),
            ]),
        ]);
    }
}
