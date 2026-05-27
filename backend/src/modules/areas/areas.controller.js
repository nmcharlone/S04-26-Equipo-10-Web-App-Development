export default class AreasController {
	constructor(service) {
		this.service = service
	}

	async listAreas(req, res) {
		const areas = await this.service.listAreas()
		res.json({ areas })
	}

	async createArea(req, res) {
		const area = await this.service.createArea(req.body)
		res.status(201).json({ area })
	}

	async updateArea(req, res) {
		const area = await this.service.updateArea(req.params.id, req.body)
		res.json({ area })
	}

	async deleteArea(req, res) {
		await this.service.deleteArea(req.params.id)
		res.status(204).send()
	}
}
