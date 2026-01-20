import { Edit, Trash2, MoreVertical } from 'lucide-react';

interface Appointment {
  id: number;
  doctorName: string;
  doctorImage: string;
  patientName: string;
  date: string;
  disease: string;
}

const appointments: Appointment[] = [
  {
    id: 1,
    doctorName: 'Dr.Allison Curtis',
    doctorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop',
    patientName: 'Makenna Press',
    date: '18/04/2023',
    disease: 'Allergies',
  },
  {
    id: 2,
    doctorName: 'Dr.Zaire Herwitz',
    doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop',
    patientName: 'Lincoln Lubin',
    date: '21/04/2023',
    disease: 'Headaches',
  },
  {
    id: 3,
    doctorName: 'Dr.Maria Culhha',
    doctorImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop',
    patientName: 'Tiana Bator',
    date: '24/04/2023',
    disease: 'Allergies',
  },
  {
    id: 4,
    doctorName: 'Dr.Giana Botosh',
    doctorImage: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=100&h=100&fit=crop',
    patientName: 'Paityn Lipshutz',
    date: '26/04/2023',
    disease: 'Allergies',
  },
];

export function BookedAppointments() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">
          Booked Appointments
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
              <th className="text-left py-2 px-2 font-medium text-gray-500">
                Patient
              </th>
              <th className="text-left py-2 px-2 font-medium text-gray-500">
                Date
              </th>
              <th className="text-left py-2 px-2 font-medium text-gray-500">
                Disease
              </th>
              <th className="text-left py-2 px-2 font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {appointments.map(appointment => (
              <tr
                key={appointment.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-2 px-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={appointment.doctorImage}
                      alt={appointment.doctorName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-gray-800">
                      {appointment.doctorName}
                    </span>
                  </div>
                </td>

                <td className="py-2 px-2 text-gray-800">
                  {appointment.patientName}
                </td>

                <td className="py-2 px-2 text-gray-700">
                  {appointment.date}
                </td>

                <td className="py-2 px-2">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[10px]">
                    {appointment.disease}
                  </span>
                </td>

                <td className="py-2 px-2">
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-red-50 rounded">
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
