export default class IncidentsRepository {
	constructor(db) {
		this.db = db
	}

	async getIncidents(whereClause, values) {
		const query = `
			SELECT * FROM incidents
			${whereClause}
			LIMIT ? OFFSET ?
		`

		return new Promise((resolve, reject) => {
			this.db.all(query, values, (err, rows) => {
				if (err) return reject(err)

				resolve(rows || [])
			})
		})
	}
	async getIncidentById(id) {
		const query = `SELECT * FROM incidents WHERE id = ?`
		return new Promise((resolve, reject) => {
			this.db.get(query, id, (err, row) => {
				if (err) {
					return reject(err)
				}
				resolve(row || null)
			})
		})
	}
	async getUserById(id) {
		const query = `SELECT * FROM users WHERE id = ?`
		return new Promise((resolve, reject) => {
			this.db.get(query, id, (err, row) => {
				if (err) {
					return reject(err)
				}
				resolve(row || null)
			})
		})
	}
	async assignTech(techId, incidentId) {
		const query = `
		UPDATE incidents 
		SET assigned_to = ?, status_id = 2
		WHERE id = ?
		`

		return new Promise((resolve, reject) => {
			this.db.run(query, [techId, incidentId], function (err) {
				if (err) return reject(err)
				resolve({ changes: this.changes })
			})
		})
	}

	async createIncident({
		type_id,
		area_id,
		description,
		status_id,
		created_by,
	}) {
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

		return new Promise((resolve, reject) => {
			this.db.run(
				query,
				[type_id, area_id, description, status_id, created_by],
				function (err) {
					if (err) return reject(err)

					resolve({
						id: this.lastID,
						type_id,
						area_id,
						description,
						status_id,
						created_by,
					})
				},
			)
		})
	}
	async findTypeById(id) {
		return new Promise((resolve, reject) => {
			this.db.get("SELECT id FROM types WHERE id = ?", [id], (err, row) => {
				if (err) return reject(err)
				resolve(row)
			})
		})
	}

	async findAreaById(id) {
		return new Promise((resolve, reject) => {
			this.db.get("SELECT id FROM areas WHERE id = ?", [id], (err, row) => {
				if (err) return reject(err)
				resolve(row)
			})
		})
	}
	async resolveIncident(id, user) {
		return new Promise((resolve, reject) => {
			this.db.run(
				`UPDATE incidents SET closed_by = ?, closed_at = CURRENT_TIMESTAMP WHERE id = ? `,
				[Number(user.user_id),id],
				function (err) {
					if (err) return reject(err)
					resolve({ changes: this.changes })
				},
			)
		})
	}
	async startIncident(incidentId) {
		return new Promise((resolve, reject) => {
			this.db.run(
				`UPDATE incidents SET status_id = ? WHERE id = ? `,
				[3, incidentId],
				function (err) {
					if (err) return reject(err)
					resolve({ changes: this.changes })
				},
			)
		})
	}
}
