<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * List user's orders
     */
    public function index(Request $request)
    {
        $orders = $request->user()->orders()
            ->with('stock')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($orders);
    }

    /**
     * Place a new order
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'stock_id' => 'required|exists:stocks,id',
            'type' => 'required|in:buy,sell',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'order_type' => 'required|in:market,limit,stop_loss',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        $wallet = $user->wallet;
        $stock = Stock::findOrFail($request->stock_id);
        $totalCost = $request->quantity * $request->price;

        // Risk Check for BUY orders
        if ($request->type === 'buy') {
            if (!$wallet || $wallet->balance < $totalCost) {
                return response()->json(['error' => 'Insufficient funds'], 400);
            }
        }

        $order = DB::transaction(function () use ($user, $request, $wallet, $totalCost) {
            // Deduct from wallet for BUY orders
            if ($request->type === 'buy') {
                $wallet->balance -= $totalCost;
                $wallet->save();
            }

            return Order::create([
                'user_id' => $user->id,
                'stock_id' => $request->stock_id,
                'type' => $request->type,
                'quantity' => $request->quantity,
                'price' => $request->price,
                'order_type' => $request->order_type,
                'status' => 'pending', // Will be processed by a queue worker
            ]);
        });

        return response()->json([
            'message' => 'Order placed successfully',
            'order' => $order->load('stock'),
        ], 201);
    }

    /**
     * Get a specific order
     */
    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($order->load('stock'));
    }

    /**
     * Cancel a pending order
     */
    public function cancel(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json(['error' => 'Only pending orders can be cancelled'], 400);
        }

        DB::transaction(function () use ($order, $request) {
            // Refund wallet for cancelled BUY orders
            if ($order->type === 'buy') {
                $wallet = $request->user()->wallet;
                $wallet->balance += ($order->quantity * $order->price);
                $wallet->save();
            }

            $order->status = 'cancelled';
            $order->save();
        });

        return response()->json([
            'message' => 'Order cancelled successfully',
            'order' => $order,
        ]);
    }
}
