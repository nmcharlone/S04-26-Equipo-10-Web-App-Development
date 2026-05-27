export default class IncidentTypesController {
	constructor(service) {
		this.service = service
	}

	async listIncidentTypes(req, res) {
		const incidentTypes = await this.service.listIncidentTypes()
		res.json({ incidentTypes })
	}

	async createIncidentType(req, res) {
		const incidentType = await this.service.createIncidentType(req.body)
		res.status(201).json({ incidentType })
	}

	async updateIncidentType(req, res) {
		const incidentType = await this.service.updateIncidentType(
			req.params.id,
			req.body,
		)
		res.json({ incidentType })
	}

	async deleteIncidentType(req, res) {
		await this.service.deleteIncidentType(req.params.id)
		res.status(204).send()
	}
}
