export default class IncidentsRepository {
	constructor(db) {
		this.db = db
	}

	getIncidents(whereClause, values) {
		const query = `
		SELECT * FROM incidents
		${whereClause}
		LIMIT ? OFFSET ?
	`

		return this.db.prepare(query).all(...values)
	}

	getIncidentById(id) {
		const query = `SELECT * FROM incidents WHERE id = ?`

		return this.db.prepare(query).get(id)
	}

	getUserById(id) {
		const query = `SELECT * FROM users WHERE id = ?`

		return this.db.prepare(query).get(id)
	}

	assignTech(techId, incidentId) {
		const query = `
		UPDATE incidents 
		SET assigned_to = ?, status_id = 2
		WHERE id = ?
	`

		const result = this.db.prepare(query).run(techId, incidentId)

		return {
			changes: result.changes,
		}
	}

	createIncident({ type_id, area_id, description, status_id, created_by }) {
		const query = `
		INSERT INTO incidents (
			type_id,
			area_id,
			description,
			status_id,
			created_by
		)
		VALUES (?, ?, ?, ?, ?)
	`

		const result = this.db
			.prepare(query)
			.run(type_id, area_id, description, status_id, created_by)

		return {
			id: result.lastInsertRowid,
			type_id,
			area_id,
			description,
			status_id,
			created_by,
		}
	}

	findTypeById(id) {
		return this.db.prepare("SELECT id FROM types WHERE id = ?").get(id)
	}

	findAreaById(id) {
		return this.db.prepare("SELECT id FROM areas WHERE id = ?").get(id)
	}

	resolveIncident(id, user) {
		const result = this.db
			.prepare(
				`
		UPDATE incidents 
		SET closed_by = ?, closed_at = CURRENT_TIMESTAMP 
		WHERE id = ?
	`,
			)
			.run(Number(user.id), id)

		return {
			changes: result.changes,
		}
	}

	startIncident(incidentId) {
		const result = this.db
			.prepare(
				`
		UPDATE incidents 
		SET status_id = ? 
		WHERE id = ?
	`,
			)
			.run(3, incidentId)

		return {
			changes: result.changes,
		}
	}
}