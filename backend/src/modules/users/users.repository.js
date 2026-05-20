export default class UsersRepository {
	constructor(db) {
		this.db = db
	}

	async listUsers() {
		const query = `
			SELECT id, name, lastname, role_id, area_id
			FROM users
			ORDER BY id ASC
		`

		return new Promise((resolve, reject) => {
			this.db.all(query, [], (err, rows) => {
				if (err) return reject(err)

				resolve(rows || [])
			})
		})
	}

	async getUserById(id) {
		const query = `SELECT * FROM users WHERE id = ?`

		return new Promise((resolve, reject) => {
			this.db.get(query, [id], (err, row) => {
				if (err) return reject(err)

				resolve(row || null)
			})
		})
	}
}