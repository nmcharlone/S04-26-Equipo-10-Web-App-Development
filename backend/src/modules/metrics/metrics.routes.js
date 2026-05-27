import express from "express"
import db from "../../config/db.js"
import { requireAuth,requireRole } from "../../middlewares/auth.middleware.js"
import { asyncHandler } from "../../middlewares/asyncHandler.middleware.js"
import MetricsRepository from "./metrics.repository.js"
import MetricsService from "./metrics.service.js"
import MetricsController from "./metrics.controller.js"

const router = express.Router()
const repository = new MetricsRepository(db)
const service = new MetricsService(repository)
const controller = new MetricsController(service)

router.get(
	"/summary",
	requireAuth,
	requireRole(4),
	asyncHandler(controller.getSummary.bind(controller))
)

export default router