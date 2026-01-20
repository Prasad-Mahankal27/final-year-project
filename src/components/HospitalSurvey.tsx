import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { ChevronDown } from "lucide-react";

const data = [
  { date: "10 Apr", newPatients: 62, oldPatients: 44 },
  { date: "11 Apr", newPatients: 55, oldPatients: 52 },
  { date: "12 Apr", newPatients: 58, oldPatients: 48 },
  { date: "13 Apr", newPatients: 75, oldPatients: 84 },
  { date: "14 Apr", newPatients: 82, oldPatients: 78 },
  { date: "15 Apr", newPatients: 78, oldPatients: 72 },
  { date: "16 Apr", newPatients: 68, oldPatients: 65 }
];

export function HospitalSurvey() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Hospital Survey
          </h3>

          <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              New Patients
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Old Patients
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
          <LineChart data={data}>
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

            <Line
              type="monotone"
              dataKey="newPatients"
              stroke="#ec4899"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="oldPatients"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
        <span>13 Apr</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-500" />
          New Patients 62
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Old Patients 44
        </div>
      </div>
    </div>
  );
}
