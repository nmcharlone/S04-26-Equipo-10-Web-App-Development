export default class MetricsRepository {
	constructor(db) {
		this.db = db
	}

	getIncidentCounts(from, to) {
		const sql = `
		SELECT
			COUNT(*) as created,
			SUM(CASE WHEN status_id IN (4,5) THEN 1 ELSE 0 END) as resolved,
			SUM(CASE WHEN status_id = 3 THEN 1 ELSE 0 END) as in_progress
		FROM incidents
		WHERE date(created_at)
		BETWEEN date(?) AND date(?)
	`

		return this.db.prepare(sql).get(from, to)
	}

	getAverageResolutionTime(from, to) {
		const sql = `
		SELECT
			AVG(
				(
					julianday(closed_at) -
					julianday(created_at)
				) * 24
			) as avg_resolution_hours
		FROM incidents
		WHERE status_id IN (4,5)
		AND closed_at IS NOT NULL
		AND date(created_at)
		BETWEEN date(?) AND date(?)
	`

		return this.db.prepare(sql).get(from, to)
	}

	getTopAreas(from, to) {
		const sql = `
		SELECT
			areas.name,
			COUNT(incidents.id) as total
		FROM incidents
		JOIN areas
			ON incidents.area_id = areas.id
		WHERE date(incidents.created_at)
		BETWEEN date(?) AND date(?)
		GROUP BY areas.id, areas.name
		ORDER BY total DESC
		LIMIT 3
	`

		return this.db.prepare(sql).all(from, to)
	}

	getTopRootCauses(from, to) {
		const sql = `
		SELECT
			root_cause.name,
			COUNT(resolutions.id) as total
		FROM resolutions
		JOIN incidents
			ON resolutions.incident_id = incidents.id
		JOIN root_cause
			ON resolutions.root_cause_id = root_cause.id
		WHERE date(incidents.created_at)
		BETWEEN date(?) AND date(?)
		GROUP BY root_cause.id, root_cause.name
		ORDER BY total DESC
		LIMIT 3
	`

		return this.db.prepare(sql).all(from, to)
	}
}
