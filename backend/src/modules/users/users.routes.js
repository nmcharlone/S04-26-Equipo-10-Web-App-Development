import express from "express"
import db from "../../config/db.js"

import UsersRepository from "./users.repository.js"
import UsersService from "./users.service.js"
import UsersController from "./users.controller.js"

import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js"
import { asyncHandler } from "../../middlewares/asyncHandler.middleware.js"

const router = express.Router()

const repository = new UsersRepository(db)
const service = new UsersService(repository)
const controller = new UsersController(service)

router.get(
	"/",
	requireAuth,
	asyncHandler(controller.listUsers.bind(controller)),
)

router.get(
	"/:id",
	requireAuth,
	asyncHandler(controller.getUserById.bind(controller)),
)
router.post(
	"/",
	requireAuth,
	requireRole(4),
	asyncHandler(controller.createUser.bind(controller)),
)
export default router
