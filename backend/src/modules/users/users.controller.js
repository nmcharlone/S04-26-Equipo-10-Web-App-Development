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
}