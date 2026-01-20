const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authMiddleware } = require("../auth");
const generateVisitId = require("../utils/visitId");

const prisma = new PrismaClient();
const router = express.Router();

router.post(
  "/create",
  authMiddleware(["DOCTOR"]),
  async (req, res) => {
    const { patientId, visitType = "NEW" } = req.body;

    const patient = await prisma.patient.findUnique({
      where: { patientId }
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const visit = await prisma.visit.create({
      data: {
        visitId: generateVisitId(),
        patientId: patient.id,
        doctorId: req.user.id,
        visitType
      }
    });

    res.json(visit);
  }
);

router.get(
  "/history/:patientId",
  authMiddleware(["DOCTOR"]),
  async (req, res) => {
    const patient = await prisma.patient.findUnique({
      where: { patientId: req.params.patientId },
      include: {
        visits: {
          orderBy: { createdAt: "desc" },
          include: { bill: true }
        }
      }
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  }
);

router.put(
  "/update/:visitId",
  authMiddleware(["DOCTOR"]),
  async (req, res) => {
    const { visitId } = req.params;

    const visit = await prisma.visit.findUnique({
      where: { visitId }
    });

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    const updatedVisit = await prisma.visit.update({
      where: { visitId },
      data: {
        symptoms: req.body.symptoms,
        diagnosis: req.body.diagnosis,
        observations: req.body.observations,
        treatmentPlan: req.body.treatmentPlan,
        procedures: req.body.procedures,
        followUpAdvice: req.body.followUpAdvice,
        medicines: req.body.medicines,
        labTests: req.body.labTests
      }
    });

    res.json(updatedVisit);
  }
);

router.get(
  "/:visitId",
  authMiddleware(["DOCTOR"]),
  async (req, res) => {
    const visit = await prisma.visit.findUnique({
      where: { visitId: req.params.visitId },
      include: {
        bill: true,
        patient: true
      }
    });

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    const lastBill = await prisma.billing.findFirst({
      where: {
        visit: {
          patientId: visit.patientId
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const previousPending = lastBill?.updatedPending || 0;

    res.json({
      ...visit,
      previousPending
    });
  }
);

router.post(
  "/close/:visitId",
  authMiddleware(["DOCTOR"]),
  async (req, res) => {
    const { visitId } = req.params;
    const { isCompleted } = req.body;

    const visit = await prisma.visit.findUnique({
      where: { visitId },
      include: { bill: true }
    });

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    if (!visit.bill) {
      return res.status(400).json({
        message: "Billing not completed for this visit"
      });
    }

    if (!isCompleted) {
      await prisma.visit.update({
        where: { visitId },
        data: {
          clinicalStatus: "IN_PROGRESS",
          caseOutcome: "ONGOING"
        }
      });

      return res.json({
        status: "ONGOING",
        message: "Follow-up required"
      });
    }

    await prisma.visit.update({
      where: { visitId },
      data: {
        clinicalStatus: "CLINICALLY_COMPLETED",
        paymentStatus:
          visit.bill.pendingAmount > 0
            ? "PARTIALLY_PAID"
            : "PAID",
        caseOutcome: "COMPLETED"
      }
    });

    res.json({
      status: "COMPLETED",
      message: "Visit completed successfully"
    });
  }
);

router.delete(
  "/:visitId",
  authMiddleware(["DOCTOR"]),
  async (req, res) => {
    const { visitId } = req.params;

    const visit = await prisma.visit.findUnique({
      where: { visitId }
    });

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    if (visit.clinicalStatus === "CLINICALLY_COMPLETED") {
      return res.status(400).json({
        message: "Completed visits cannot be deleted"
      });
    }

    await prisma.visit.delete({
      where: { visitId }
    });

    res.sendStatus(204);
  }
);

router.patch(
  "/:visitId/type",
  authMiddleware(["DOCTOR"]),
  async (req, res) => {
    const { visitId } = req.params;
    const { visitType } = req.body;

    if (!["NEW", "FOLLOW_UP"].includes(visitType)) {
      return res.status(400).json({ message: "Invalid visit type" });
    }

    const visit = await prisma.visit.findUnique({
      where: { visitId }
    });

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    if (
      visit.symptoms ||
      visit.diagnosis ||
      visit.treatmentPlan
    ) {
      return res.status(400).json({
        message:
          "Visit type cannot be changed after clinical work starts"
      });
    }

    const updated = await prisma.visit.update({
      where: { visitId },
      data: { visitType }
    });

    res.json(updated);
  }
);

module.exports = router;
