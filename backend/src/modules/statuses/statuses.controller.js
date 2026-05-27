export default class StatusesController {
	constructor(service) {
		this.service = service
	}

	async listStatuses(req, res) {
		const statuses = await this.service.listStatuses()
		res.json({ statuses })
	}
}
