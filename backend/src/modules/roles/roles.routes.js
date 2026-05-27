import express from "express"
import db from "../../config/db.js"
import { requireAuth } from "../../middlewares/auth.middleware.js"
import { asyncHandler } from "../../middlewares/asyncHandler.middleware.js"
import RolesRepository from "./roles.repository.js"
import RolesService from "./roles.service.js"
import RolesController from "./roles.controller.js"

const router = express.Router()
const repository = new RolesRepository(db)
const service = new RolesService(repository)
const controller = new RolesController(service)

router.get("/", requireAuth, asyncHandler(controller.listRoles.bind(controller)))

export default router
