import { MoreVertical } from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  image: string;
  status: "Available" | "Absent";
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr.Ruben Bothman",
    specialization: "GI (Gen Surgery), FRCS(1), FRCS(1), DHB",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop",
    status: "Available"
  },
  {
    id: 2,
    name: "Dr.Kierra GA",
    specialization: "MBBS, DCR-MD, DM (Neurology)",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    status: "Absent"
  },
  {
    id: 3,
    name: "Dr.Anika Septimus",
    specialization: "DM (RT), BA, MA",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    status: "Available"
  },
  {
    id: 4,
    name: "Dr.Jakob Passal",
    specialization: "MD, DM, FRCP (UK), FSCAI",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop",
    status: "Available"
  }
];

export function DoctorsList() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">
          Doctors List
        </h3>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="max-h-[220px] overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 font-medium text-gray-500">
                Doctor
              </th>
              <th className="text-right py-2 px-2 font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {doctors.map(doctor => (
              <tr
                key={doctor.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-2 px-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-gray-800 font-medium">
                        {doctor.name}
                      </div>
                      <div className="text-gray-500 text-[10px]">
                        {doctor.specialization}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-2 px-2 text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${
                      doctor.status === "Available"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        doctor.status === "Available"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                    {doctor.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
