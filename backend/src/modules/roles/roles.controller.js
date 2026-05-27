export default class RolesController {
	constructor(service) {
		this.service = service
	}

	async listRoles(req, res) {
		const roles = await this.service.listRoles()
		res.json({ roles })
	}
}
