export default class RolesRepository {
	constructor(db) {
		this.db = db
	}

	listRoles() {
		return this._all("SELECT id, name FROM roles ORDER BY id ASC")
	}

	_all(sql, params = []) {
		return this.db.prepare(sql).all(...params)
	}
}
