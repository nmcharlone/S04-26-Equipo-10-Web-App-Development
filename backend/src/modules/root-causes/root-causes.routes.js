import express from "express"
import db from "../../config/db.js"
import RootCausesRepository from "./root-causes.repository.js"
import RootCausesService from "./root-causes.service.js"
import RootCausesController from "./root-causes.controller.js"
import { requireAuth } from "../../middlewares/auth.middleware.js"
import { asyncHandler } from "../../middlewares/asyncHandler.middleware.js"

const router = express.Router()

const rootCausesRepository = new RootCausesRepository(db)
const rootCausesService = new RootCausesService(rootCausesRepository)
const rootCausesController = new RootCausesController(rootCausesService)

router.get("/", requireAuth, asyncHandler(rootCausesController.getRootCauses.bind(rootCausesController)))

export default router