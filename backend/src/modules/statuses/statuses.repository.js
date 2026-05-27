export default class StatusesRepository {
	constructor(db) {
		this.db = db
	}

	listStatuses() {
		return this._all("SELECT id, name FROM status ORDER BY id ASC")
	}

	_all(sql, params = []) {
		return this.db.prepare(sql).all(...params)
	}
}
