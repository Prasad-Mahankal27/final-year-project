import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  FileText,
  CreditCard,
  CheckCircle
} from "lucide-react";

import VisitClinicalForm from "./VisitClinicalForm";
import BillingForm from "./BillingForm";

/* ---------------- TYPES ---------------- */

type Step = 1 | 2 | 3 | 4;

interface VisitWorkflowProps {
  token: string;
}

/* ---------------- COMPONENT ---------------- */

export default function VisitWorkflow({ token }: VisitWorkflowProps) {
  const { visitId } = useParams<{ visitId: string }>();
  const navigate = useNavigate();

  const [visit, setVisit] = useState<any>(null);
  const [activeStep, setActiveStep] = useState<Step>(1);
  const [clinicalSaved, setClinicalSaved] = useState(false);
  const [closeStatus, setCloseStatus] = useState<boolean | null>(null);
  const [closing, setClosing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitType, setVisitType] = useState<"NEW" | "FOLLOW_UP">("NEW");

  const fetchVisit = useCallback(async () => {
    if (!visitId) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `http://localhost:4000/visits/${visitId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load visit");
      }

      setVisit(data);
      setClinicalSaved(
        Boolean(
          data.symptoms ||
          data.diagnosis ||
          data.observations ||
          data.treatmentPlan ||
          data.procedures
        )
      );

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to load visit");
    } finally {
      setLoading(false);
    }
  }, [visitId, token]);

  useEffect(() => {
    fetchVisit();
  }, [fetchVisit]);

  function canGoToStep(step: Step) {
    if (step === 1 || step === 2) return true;
    if (step >= 3 && clinicalSaved) return true;
    return false;
  }

  function goToStep(step: Step) {
    if (canGoToStep(step)) {
      setActiveStep(step);
    }
  }

    async function updateVisitType(type: "NEW" | "FOLLOW_UP") {
        setVisitType(type);

        await fetch(
            `http://localhost:4000/visits/${visit.visitId}/type`,
            {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ visitType: type })
            }
        );

        // refresh visit from DB
        fetchVisit();
        }

  async function closeVisit() {
    if (closeStatus === null || !visit) return;

    try {
      setClosing(true);

      const res = await fetch(
        `http://localhost:4000/visits/close/${visit.visitId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            isCompleted: closeStatus
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to close visit");
      }

      navigate("/doctor");

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to close visit");
    } finally {
      setClosing(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading visit…
      </div>
    );
  }

  if (error || !visit || !visit.patient) {
    return (
      <div className="p-6 text-center text-red-600">
        {error || "Invalid visit data"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">

        <button
        disabled={activeStep === 4}
  onClick={async () => {
    try {
      if (visit?.visitId) {
        await fetch(
        `http://localhost:4000/visits/${visit.visitId}`,
        {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        }
        );
      }
    } catch (e) {
      console.error("Failed to delete visit", e);
    }

    const patientQuery =
      visit?.patient?.patientId || visit?.patient?.phone;

    if (patientQuery) {
      navigate(`/doctor?query=${patientQuery}`);
    } else {
      navigate("/doctor/patient/:patientId");
    }
  }}
  className="mb-4 text-sm text-emerald-600 hover:underline"
>
  ← Back to Visits
</button>

        <div className="flex flex-wrap justify-between gap-2 mb-6">
          {[
            { step: 1, label: "Patient Info", icon: User },
            { step: 2, label: "Clinical Details", icon: FileText },
            { step: 3, label: "Billing", icon: CreditCard },
            { step: 4, label: "Complete", icon: CheckCircle }
          ].map(({ step, label, icon: Icon }) => {
            const enabled = canGoToStep(step as Step);
            const active = activeStep === step;

            return (
              <button
                key={step}
                disabled={!enabled}
                onClick={() => goToStep(step as Step)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition
                  ${
                    active
                      ? "bg-emerald-600 text-white"
                      : enabled
                      ? "bg-white border hover:bg-gray-50"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>

        {activeStep === 1 && (
<div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visit Type
              </label>
              <select
                value={visit.visitType}
                onChange={e =>
                  updateVisitType(e.target.value as "NEW" | "FOLLOW_UP")
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="NEW">New Visit</option>
                <option value="FOLLOW_UP">Follow-up</option>
              </select>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Patient Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
              <div className="text-gray-700">
                <span className="font-semibold">Name:</span>{" "}
                <span className="text-gray-600">{visit.patient.name}</span>
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">Phone:</span>{" "}
                <span className="text-gray-600">{visit.patient.phone}</span>
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">Patient ID:</span>{" "}
                <span className="text-gray-600">{visit.patient.patientId}</span>
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">Gender:</span>{" "}
                <span className="text-gray-600">{visit.patient.gender || "—"}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveStep(2)}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Continue to Clinical Details
            </button>
          </div>
        )}

        {activeStep === 2 && (
          <VisitClinicalForm
            visit={visit}
            token={token}
            onSaved={() => {
              setClinicalSaved(true);
              setActiveStep(3);
              fetchVisit(); 
            }}
          />
        )}

        {activeStep === 3 && (
          <div className="bg-white rounded-lg border p-6">
            <BillingForm
              visit={visit}
              token={token}
              onBillingDone={() => {
                fetchVisit(); 
                setActiveStep(4);
              }}
            />
          </div>
        )}

        {activeStep === 4 && (

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">
              Complete Visit
            </h2>

            <p className="mb-3">
              Is the case fully completed?
            </p>

            <div className="flex gap-6 mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="complete"
                  onChange={() => setCloseStatus(true)}
                />
                Yes
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="complete"
                  onChange={() => setCloseStatus(false)}
                />
                No (Follow-up Required)
              </label>
            </div>

            <button
              disabled={closeStatus === null || closing}
              onClick={closeVisit}
              className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {closing ? "Closing…" : "Close Visit"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
