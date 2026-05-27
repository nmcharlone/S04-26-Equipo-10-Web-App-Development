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
	createUser({ name, lastname, password, role_id, area_id }) {
		const query = `
			INSERT INTO users (name, lastname, password, role_id, area_id)
			VALUES (?, ?, ?, ?, ?)
		`

		const stmt = this.db.prepare(query)

		const result = stmt.run(name, lastname, password, role_id, area_id)

		return {
			id: result.lastInsertRowid,
			name,
			lastname,
			role_id,
			area_id,
		}
	}
	updateUser(id, userData) {
		const fields = []
		const values = []

		for (const [key, value] of Object.entries(userData)) {
			fields.push(`${key} = ?`)
			values.push(value)
		}

		values.push(id)

		const query = `
			UPDATE users
			SET ${fields.join(", ")}
			WHERE id = ?
		`

		const stmt = this.db.prepare(query)

		const result = stmt.run(...values)

		return {
			changes: result.changes,
		}
	}
}
