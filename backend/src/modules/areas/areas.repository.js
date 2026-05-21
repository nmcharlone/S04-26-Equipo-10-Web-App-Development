export default class AreasRepository {
	constructor(db) {
		this.db = db
	}

	listAreas() {
		return this._all("SELECT id, name FROM areas ORDER BY name COLLATE NOCASE")
	}

	insertArea(name) {
		return this._runInsert("INSERT INTO areas (name) VALUES (?)", [name], {
			name,
		})
	}

	updateArea(id, name) {
		return this._runUpdate("UPDATE areas SET name = ? WHERE id = ?", [name, id])
	}

	deleteArea(id) {
		return this._runDelete("DELETE FROM areas WHERE id = ?", [id])
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
