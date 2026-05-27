import express from "express"
import db from "../../config/db.js"
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js"
import { asyncHandler } from "../../middlewares/asyncHandler.middleware.js"
import AreasRepository from "./areas.repository.js"
import AreasService from "./areas.service.js"
import AreasController from "./areas.controller.js"

const router = express.Router()
const repository = new AreasRepository(db)
const service = new AreasService(repository)
const controller = new AreasController(service)

const canManageCatalogs = requireRole(3, 4)

router.get("/", requireAuth, asyncHandler(controller.listAreas.bind(controller)))
router.post(
	"/",
	requireAuth,
	canManageCatalogs,
	asyncHandler(controller.createArea.bind(controller)),
)
router.put(
	"/:id",
	requireAuth,
	canManageCatalogs,
	asyncHandler(controller.updateArea.bind(controller)),
)
router.delete(
	"/:id",
	requireAuth,
	canManageCatalogs,
	asyncHandler(controller.deleteArea.bind(controller)),
)

export default router
