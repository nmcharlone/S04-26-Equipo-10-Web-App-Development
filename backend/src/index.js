import "dotenv/config"
import express from "express"

import incidentsRoutes from "./modules/incidents/incidents.routes.js"
import authRoutes from "./modules/auth/auth.routes.js"
import areasRoutes from "./modules/areas/areas.routes.js"
import incidentTypesRoutes from "./modules/incident-types/incident-types.routes.js"
import statusesRoutes from "./modules/statuses/statuses.routes.js"
import rolesRoutes from "./modules/roles/roles.routes.js"
import rootCausesRoutes from "./modules/root-causes/root-causes.routes.js"
import usersRoutes from "./modules/users/users.routes.js"
import metricsRoutes from "./modules/metrics/metrics.routes.js"

const router = express.Router()

router.use("/incidents", incidentsRoutes)
router.use("/auth", authRoutes)

router.use("/catalogs/areas", areasRoutes)
router.use("/catalogs/incident-types", incidentTypesRoutes)
router.use("/catalogs/statuses", statusesRoutes)
router.use("/catalogs/roles", rolesRoutes)
router.use("/catalogs/root-causes", rootCausesRoutes)
router.use("/metrics", metricsRoutes)

router.use("/users", usersRoutes)

router.get("/health", (req, res) => {
	res.status(200).json({
		status: "ok",
		message: "API running",
		timestamp: new Date().toISOString(),
	})
})

router.use((req, res) => {
	res.status(404).json({
		error: "Not Found",
		message: `Route ${req.originalUrl} not found`,
	})
})

export default router