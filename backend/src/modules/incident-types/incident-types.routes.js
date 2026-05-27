import express from "express"
import db from "../../config/db.js"
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js"
import { asyncHandler } from "../../middlewares/asyncHandler.middleware.js"
import IncidentTypesRepository from "./incident-types.repository.js"
import IncidentTypesService from "./incident-types.service.js"
import IncidentTypesController from "./incident-types.controller.js"

const router = express.Router()
const repository = new IncidentTypesRepository(db)
const service = new IncidentTypesService(repository)
const controller = new IncidentTypesController(service)

const canManageCatalogs = requireRole(3, 4)

router.get(
	"/",
	requireAuth,
	asyncHandler(controller.listIncidentTypes.bind(controller)),
)
router.post(
	"/",
	requireAuth,
	canManageCatalogs,
	asyncHandler(controller.createIncidentType.bind(controller)),
)
router.put(
	"/:id",
	requireAuth,
	canManageCatalogs,
	asyncHandler(controller.updateIncidentType.bind(controller)),
)
router.delete(
	"/:id",
	requireAuth,
	canManageCatalogs,
	asyncHandler(controller.deleteIncidentType.bind(controller)),
)

export default router
