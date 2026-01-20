import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { ChevronDown } from "lucide-react";

const data = [
  { date: "10 Apr", coldsAndFlu: 45, allergies: 52, headaches: 38 },
  { date: "11 Apr", coldsAndFlu: 58, allergies: 48, headaches: 42 },
  { date: "12 Apr", coldsAndFlu: 68, allergies: 62, headaches: 55 },
  { date: "13 Apr", coldsAndFlu: 52, allergies: 70, headaches: 48 },
  { date: "14 Apr", coldsAndFlu: 45, allergies: 82, headaches: 72 },
  { date: "15 Apr", coldsAndFlu: 72, allergies: 68, headaches: 58 },
  { date: "16 Apr", coldsAndFlu: 85, allergies: 92, headaches: 78 }
];

export function CommonDiseasesReport() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Common Diseases Report
          </h3>

          <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Colds & Flu
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Allergies
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-800"></span>
              Headaches
            </div>
          </div>
        </div>

        <button className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">
          10–16 Apr
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 10 }}
            />
            <Bar
              dataKey="coldsAndFlu"
              fill="#60a5fa"
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="allergies"
              fill="#2563eb"
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="headaches"
              fill="#1e40af"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
        <span>13 Apr</span>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          Allergies 92
        </div>
      </div>
    </div>
  );
}
