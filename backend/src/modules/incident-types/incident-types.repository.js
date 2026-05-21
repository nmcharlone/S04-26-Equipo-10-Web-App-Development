export default class IncidentTypesRepository {
	constructor(db) {
		this.db = db
	}

	listIncidentTypes() {
		return this._all("SELECT id, name FROM types ORDER BY name COLLATE NOCASE")
	}

	insertIncidentType(name) {
		return this._runInsert("INSERT INTO types (name) VALUES (?)", [name], {
			name,
		})
	}

	updateIncidentType(id, name) {
		return this._runUpdate("UPDATE types SET name = ? WHERE id = ?", [name, id])
	}

	deleteIncidentType(id) {
		return this._runDelete("DELETE FROM types WHERE id = ?", [id])
	}

	_all(sql, params = []) {
		return this.db.prepare(sql).all(...params)
	}

	_runInsert(sql, params, rowShape) {
		const result = this.db.prepare(sql).run(...params)

		return {
			id: result.lastInsertRowid,
			...rowShape,
		}
	}

	_runUpdate(sql, params) {
		const result = this.db.prepare(sql).run(...params)

		return {
			changes: result.changes,
		}
	}

	_runDelete(sql, params) {
		const result = this.db.prepare(sql).run(...params)

		return {
			changes: result.changes,
		}
	}
}
