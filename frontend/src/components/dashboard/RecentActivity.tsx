"use client"

import { Badge } from "@/components/ui/badge"

const activities = [
  { id: 1, type: "Buy", asset: "BTC/USD", amount: "0.45 BTC", price: "$42,391.50", time: "12:45:30", status: "Filled" },
  { id: 2, type: "Sell", asset: "ETH/USD", amount: "12.5 ETH", price: "$2,240.10", time: "12:42:15", status: "Filled" },
  { id: 3, type: "Limit Buy", asset: "SOL/USD", amount: "150 SOL", price: "$98.50", time: "12:30:00", status: "Pending" },
  { id: 4, type: "Buy", asset: "BTC/USD", amount: "0.12 BTC", price: "$42,350.00", time: "11:15:45", status: "Filled" },
]

export function RecentActivity() {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-slate-900" />
            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Recent Activity</h3>
          </div>
          <button className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50 transition-colors">
              VIEW ALL
          </button>
      </div>

      <div className="flex-1 overflow-auto -mx-2 px-2">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-white z-10 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
            <tr>
              <th className="pb-2 pl-2">Type</th>
              <th className="pb-2">Asset</th>
              <th className="pb-2 text-right">Amount</th>
              <th className="pb-2 text-right">Price</th>
              <th className="pb-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {activities.map((item) => (
              <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                <td className="py-2 pl-2">
                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.type.includes('Buy') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                     {item.type}
                   </span>
                </td>
                <td className="py-2 font-bold text-slate-700">{item.asset}</td>
                <td className="py-2 text-right font-mono text-slate-600">{item.amount}</td>
                <td className="py-2 text-right font-mono text-slate-900 font-bold">{item.price}</td>
                <td className="py-2 text-right pr-2">
                    <span className={`text-[10px] uppercase font-bold ${item.status === 'Pending' ? 'text-amber-500' : 'text-slate-400'}`}>
                        {item.status}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
