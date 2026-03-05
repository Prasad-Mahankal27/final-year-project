const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { authMiddleware } = require("./auth");

const prisma = new PrismaClient();

router.get("/stats", authMiddleware(["DOCTOR", "RECEPTIONIST"]), async (req, res) => {
    try {
        const totalVisits = await prisma.visit.count();
        const completedVisits = await prisma.visit.count({
            where: { caseOutcome: "COMPLETED" }
        });
        const newPatientsCount = await prisma.patient.count();
        const earningsAggr = await prisma.billing.aggregate({
            _sum: { paidAmount: true }
        });
        const totalEarnings = earningsAggr._sum.paidAmount || 0;

        const recentAppointments = await prisma.visit.findMany({
            include: {
                patient: { select: { name: true } },
                doctor: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" },
            take: 5
        });

        const doctorsList = await prisma.user.findMany({
            where: { role: "DOCTOR" },
            select: { id: true, name: true, createdAt: true }
        });

        // Calculate Last 7 Days Statistics
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const last7DaysVisits = await prisma.visit.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { createdAt: true, visitType: true, procedures: true, diagnosis: true }
        });

        const last7DaysPatients = await prisma.patient.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { createdAt: true }
        });

        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(sevenDaysAgo);
            date.setDate(date.getDate() + i);
            days.push({
                dateObj: date,
                label: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
            });
        }

        const patientSurveyData = days.map(day => {
            const start = new Date(day.dateObj);
            const end = new Date(day.dateObj);
            end.setHours(23, 59, 59, 999);

            const newPatients = last7DaysPatients.filter(p => p.createdAt >= start && p.createdAt <= end).length;
            const recurringPatients = last7DaysVisits.filter(v =>
                v.createdAt >= start && v.createdAt <= end && v.visitType === "FOLLOW_UP"
            ).length;

            return {
                date: day.label,
                newPatients,
                recurringPatients
            };
        });

        const dentalIssuesData = days.map(day => {
            const start = new Date(day.dateObj);
            const end = new Date(day.dateObj);
            end.setHours(23, 59, 59, 999);

            const dailyVisits = last7DaysVisits.filter(v => v.createdAt >= start && v.createdAt <= end);

            const countIssue = (keywords) => dailyVisits.filter(v => {
                const text = `${v.procedures || ""} ${v.diagnosis || ""}`.toLowerCase();
                return keywords.some(k => text.includes(k));
            }).length;

            return {
                date: day.label,
                cavities: countIssue(["cavity", "filling", "caries"]),
                gumDisease: countIssue(["gum", "gingiv", "periodon", "scaling"]),
                rootCanals: countIssue(["root canal", "rct", "endodontic"])
            };
        });

        res.json({
            appointments: totalVisits,
            operations: completedVisits,
            newPatients: newPatientsCount,
            earnings: totalEarnings.toLocaleString("en-IN"),
            recentAppointments,
            doctorsList,
            patientSurveyData,
            dentalIssuesData
        });
    } catch (err) {
        console.error("Dashboard stats error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
