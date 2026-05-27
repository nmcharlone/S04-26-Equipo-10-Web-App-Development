export default class ResolutionsRepository {
	constructor(db) {
		this.db = db
	}
	createResolution(incidentId, solution, root_cause_id) {
		const query = `
		INSERT INTO resolutions (
			incident_id,
			solution,
			root_cause_id
		)
		VALUES (?, ?, ?)
	`

		const result = this.db
			.prepare(query)
			.run(incidentId, solution, root_cause_id)

		return {
			id: result.lastInsertRowid,
			changes: result.changes,
		}
	}
}
