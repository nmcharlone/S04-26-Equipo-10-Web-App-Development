import express from "express"
import db from "../../config/db.js"
import { requireAuth } from "../../middlewares/auth.middleware.js"
import { asyncHandler } from "../../middlewares/asyncHandler.middleware.js"
import StatusesRepository from "./statuses.repository.js"
import StatusesService from "./statuses.service.js"
import StatusesController from "./statuses.controller.js"

const router = express.Router()
const repository = new StatusesRepository(db)
const service = new StatusesService(repository)
const controller = new StatusesController(service)

router.get(
	"/",
	requireAuth,
	asyncHandler(controller.listStatuses.bind(controller)),
)

export default router
