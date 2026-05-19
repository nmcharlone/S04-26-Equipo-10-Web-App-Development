export default class IncidentsController {
	constructor(IncidentsService, ResolutionsService) {
		this.IncidentsService = IncidentsService
		this.ResolutionsService = ResolutionsService
	}
	async getIncidents(req, res) {
		const query = req.query
		const user = req.user
		const incidents = await this.IncidentsService.getIncidents(user, query)
		res.json({ incidents })
	}
	async assignIncident(req, res) {
		const { technician_id } = req.body
		const { id } = req.params
		const incident = await this.IncidentsService.assignTechnician(
			Number(technician_id),
			Number(id),
		)
		res.json({ msg: "Assignded succesfully", incident })
	}
	async createIncident(req, res) {
		const { type_id, area_id, description } = req.body || {}

		const user = req.user

		const incident = await this.IncidentsService.createIncident({
			type_id,
			area_id,
			description,
			created_by: user.id,
		})

		return res.status(201).json(incident)
	}
	async resolveIncident(req, res) {
		const { id } = req.params
		const { solution, root_cause_id } = req.body
		await this.IncidentsService.resolveIncident(Number(id), req.user)
		const incident = await this.IncidentsService.findIncidentById(Number(id))
		const resolution = await this.ResolutionsService.createResolution(
			Number(id),
			solution,
			root_cause_id,
		)
		res.status(201).json({ incident, resolution })
	}
	async startIncident(req, res) {
		const { id } = req.params

		const incident = await this.IncidentsService.startIncident(
			Number(id),
			req.user,
		)

		res.json({
			msg: "Incident started successfully",
			incident,
		})
	}
}
