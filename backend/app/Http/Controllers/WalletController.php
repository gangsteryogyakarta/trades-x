<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class WalletController extends Controller
{
    /**
     * Get user's wallet balance
     */
    public function balance(Request $request)
    {
        $wallet = $request->user()->wallet;

        if (!$wallet) {
            return response()->json(['error' => 'Wallet not found'], 404);
        }

        return response()->json([
            'balance' => $wallet->balance,
            'currency' => $wallet->currency,
            'is_active' => $wallet->is_active,
        ]);
    }

    /**
     * Deposit funds to wallet
     */
    public function deposit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:10000', // Min 10,000 IDR
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $wallet = $request->user()->wallet;

        if (!$wallet || !$wallet->is_active) {
            return response()->json(['error' => 'Wallet not active'], 400);
        }

        DB::transaction(function () use ($wallet, $request) {
            $wallet->balance += $request->amount;
            $wallet->save();
        });

        return response()->json([
            'message' => 'Deposit successful',
            'new_balance' => $wallet->balance,
        ]);
    }

    /**
     * Withdraw funds from wallet
     */
    public function withdraw(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:10000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $wallet = $request->user()->wallet;

        if (!$wallet || !$wallet->is_active) {
            return response()->json(['error' => 'Wallet not active'], 400);
        }

        if ($wallet->balance < $request->amount) {
            return response()->json(['error' => 'Insufficient balance'], 400);
        }

        DB::transaction(function () use ($wallet, $request) {
            $wallet->balance -= $request->amount;
            $wallet->save();
        });

        return response()->json([
            'message' => 'Withdrawal successful',
            'new_balance' => $wallet->balance,
        ]);
    }

    /**
     * Get transaction history (placeholder)
     */
    public function history(Request $request)
    {
        // In a real app, we'd have a WalletTransaction model
        return response()->json([
            'message' => 'Transaction history coming soon',
            'transactions' => [],
        ]);
    }
}
