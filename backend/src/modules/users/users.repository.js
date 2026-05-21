export default class UsersRepository {
	constructor(db) {
		this.db = db
	}

	listUsers() {
		const query = `
		SELECT id, name, lastname, role_id, area_id
		FROM users
		ORDER BY id ASC
	`

		return this.db.prepare(query).all()
	}

	getUserById(id) {
		const query = `SELECT * FROM users WHERE id = ?`

		return this.db.prepare(query).get(id)
	}
}
