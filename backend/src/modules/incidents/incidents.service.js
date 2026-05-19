import { BadRequestError, ConflictError } from "../../errors/errors.js"

export default class IncidentsService {
	constructor(IncidentsRepository) {
		this.IncidentsRepository = IncidentsRepository
	}
	getFilters(user, query) {
		let { status_id, area_id, assigned_to, created_by, page, limit } = query
		let conditions = []
		let values = []

		const parsedPage = Number(page)
		const parsedLimit = Number(limit)

		const safePage = parsedPage > 0 ? parsedPage : 1
		const safeLimit = parsedLimit > 0 ? Math.min(parsedLimit, 100) : 20

		const offset = (safePage - 1) * safeLimit

		switch (Number(user.role_id)) {
			case 1:
				created_by = user.id
				conditions.push("created_by = ?")
				values.push(Number(created_by))
				break

			case 2:
				assigned_to = user.id
				conditions.push("assigned_to = ?")
				values.push(Number(assigned_to))
				break
			case 3:
				area_id = Number(user.area_id)
				conditions.push("area_id = ?")
				values.push(Number(area_id))
				break
			case 4:
				break

			default:
				break
		}

		if (status_id) {
			conditions.push("status_id = ?")
			values.push(Number(status_id))
		}

		if (area_id) {
			conditions.push("area_id = ?")
			values.push(Number(area_id))
		}

		if (assigned_to) {
			conditions.push("assigned_to = ?")
			values.push(Number(assigned_to))
		}
		if (created_by) {
			conditions.push("created_by = ?")
			values.push(Number(created_by))
		}
		values.push(safeLimit, offset)
		return { conditions, values }
	}
	async getIncidents(user, query) {
		const { conditions, values } = this.getFilters(user, query)
		console.log(conditions)
		console.log(values)

		let whereClause = ""
		if (conditions.length > 0) {
			whereClause = "WHERE " + conditions.join(" AND ")
		}
		const incidents = await this.IncidentsRepository.getIncidents(
			whereClause,
			values,
		)
		return incidents
	}
	async assignTechnician(techId, incidentId) {
		const incident = await this.IncidentsRepository.getIncidentById(incidentId)
		const tech = await this.IncidentsRepository.getUserById(techId)
		if (tech.role_id == 2 && tech.area_id == incident.area_id) {
			await this.IncidentsRepository.assignTech(techId, incidentId)
			const updatedIncident =
				await this.IncidentsRepository.getIncidentById(incidentId)
			return updatedIncident
		}
		throw new BadRequestError("Technician and incident don´t match")
	}
	async createIncident({ type_id, area_id, description, created_by }) {
		if (!type_id || !area_id || !description) {
			throw new BadRequestError("Missing required fields")
		}

		const typeExists = await this.IncidentsRepository.findTypeById(type_id)
		if (!typeExists) {
			throw new BadRequestError("Invalid type_id")
		}

		const areaExists = await this.IncidentsRepository.findAreaById(area_id)
		if (!areaExists) {
			throw new BadRequestError("Invalid area_id")
		}

		const incident = await this.IncidentsRepository.createIncident({
			type_id: Number(type_id),
			area_id: Number(area_id),
			description,
			status_id: 1,
			created_by,
		})

		return incident
	}
	async resolveIncident(id, user) {
		await this.IncidentsRepository.resolveIncident(id, user)
	}
	async startIncident(incidentId, user) {
		const incident = await this.IncidentsRepository.getIncidentById(incidentId)

		if (!incident) {
			throw new BadRequestError("Incident not found")
		}

		if (incident.assigned_to !== user.id) {
			throw new BadRequestError("You are not assigned to this incident")
		}

		if (incident.status_id !== 2) {
			throw new ConflictError("Incident is not assigned")
		}

		await this.IncidentsRepository.startIncident(incidentId)

		return await this.IncidentsRepository.getIncidentById(incidentId)
	}
}
