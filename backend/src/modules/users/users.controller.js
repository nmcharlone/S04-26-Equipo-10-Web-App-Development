import { BadRequestError, NotFoundError } from "../../errors/errors.js"
export default class UsersController {
	constructor(service) {
		this.service = service
	}

	async listUsers(req, res) {
		const users = await this.service.listUsers()

		res.json({ users })
	}

	async getUserById(req, res) {
		const { id } = req.params

		const user = await this.service.getUserById(Number(id))

		res.json({ user })
	}
	async createUser(req, res) {
		const { name, lastname, password, role_id, area_id } = req.body

		const user = await this.service.createUser({
			name,
			lastname,
			password,
			role_id,
			area_id,
		})

		return res.status(201).json({
			status: "User created succesfully",
			data: user,
		})
	}
	async updateUser(req, res) {
		const { id } = req.params

		const allowedFields = ["name", "lastname", "password", "role_id", "area_id"]

		const dataToUpdate = {}

		for (const field of allowedFields) {
			if (req.body[field] !== undefined) {
				dataToUpdate[field] = req.body[field]
			}
		}

		if (Object.keys(dataToUpdate).length === 0) {
			throw new BadRequestError("No fields to update")
		}

		const result = await this.service.updateUser(id, dataToUpdate)

		if (result.changes === 0) {
			throw new NotFoundError("User not found")
		}

		return res.json({
			status: "success",
			message: "User updated successfully",
		})
	}
}
