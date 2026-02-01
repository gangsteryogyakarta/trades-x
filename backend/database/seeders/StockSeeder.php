<?php

namespace Database\Seeders;

use App\Models\Stock;
use Illuminate\Database\Seeder;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stocks = [
            // Banking
            ['ticker' => 'BBCA', 'name' => 'Bank Central Asia', 'sector' => 'Banks', 'last_price' => 9875],
            ['ticker' => 'BBRI', 'name' => 'Bank Rakyat Indonesia', 'sector' => 'Banks', 'last_price' => 5825],
            ['ticker' => 'BMRI', 'name' => 'Bank Mandiri', 'sector' => 'Banks', 'last_price' => 6450],
            ['ticker' => 'BBNI', 'name' => 'Bank Negara Indonesia', 'sector' => 'Banks', 'last_price' => 5125],
            
            // Telco
            ['ticker' => 'TLKM', 'name' => 'Telkom Indonesia', 'sector' => 'Telecommunications', 'last_price' => 3980],
            ['ticker' => 'EXCL', 'name' => 'XL Axiata', 'sector' => 'Telecommunications', 'last_price' => 2340],
            ['ticker' => 'ISAT', 'name' => 'Indosat Ooredoo', 'sector' => 'Telecommunications', 'last_price' => 8750],
            
            // Consumer
            ['ticker' => 'UNVR', 'name' => 'Unilever Indonesia', 'sector' => 'Consumer Goods', 'last_price' => 4230],
            ['ticker' => 'ICBP', 'name' => 'Indofood CBP Sukses Makmur', 'sector' => 'Consumer Goods', 'last_price' => 10850],
            ['ticker' => 'INDF', 'name' => 'Indofood Sukses Makmur', 'sector' => 'Consumer Goods', 'last_price' => 6675],
            
            // Mining & Energy
            ['ticker' => 'ADRO', 'name' => 'Adaro Energy', 'sector' => 'Mining', 'last_price' => 2890],
            ['ticker' => 'PTBA', 'name' => 'Bukit Asam', 'sector' => 'Mining', 'last_price' => 2730],
            ['ticker' => 'INCO', 'name' => 'Vale Indonesia', 'sector' => 'Mining', 'last_price' => 4560],
            ['ticker' => 'ANTM', 'name' => 'Aneka Tambang', 'sector' => 'Mining', 'last_price' => 1485],
            
            // Tech & Digital
            ['ticker' => 'GOTO', 'name' => 'GoTo Gojek Tokopedia', 'sector' => 'Technology', 'last_price' => 72],
            ['ticker' => 'BUKA', 'name' => 'Bukalapak', 'sector' => 'Technology', 'last_price' => 115],
            
            // Property
            ['ticker' => 'BSDE', 'name' => 'Bumi Serpong Damai', 'sector' => 'Property', 'last_price' => 1075],
            ['ticker' => 'CTRA', 'name' => 'Ciputra Development', 'sector' => 'Property', 'last_price' => 1195],
            
            // Crypto (Mock - prices in thousands IDR for simplicity)
            ['ticker' => 'BTC', 'name' => 'Bitcoin', 'sector' => 'Cryptocurrency', 'last_price' => 67500],
            ['ticker' => 'ETH', 'name' => 'Ethereum', 'sector' => 'Cryptocurrency', 'last_price' => 35000],
            ['ticker' => 'GOLD', 'name' => 'Gold (XAU/IDR)', 'sector' => 'Commodities', 'last_price' => 10500],
        ];

        foreach ($stocks as $stockData) {
            Stock::updateOrCreate(
                ['ticker' => $stockData['ticker']],
                array_merge($stockData, [
                    'previous_close' => $stockData['last_price'] * (1 + (rand(-5, 5) / 100)),
                    'change_percentage' => round((rand(-500, 500) / 100), 2),
                    'volume' => rand(100000, 50000000),
                ])
            );
        }
    }
}
