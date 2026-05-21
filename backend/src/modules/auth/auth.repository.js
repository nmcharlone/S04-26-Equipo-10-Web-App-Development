export default class AuthRepository {
	constructor(db) {
		this.db = db
	}

	// async findUser(name, lastname) {
	// 	return new Promise((resolve, reject) => {
	// 		this.db.get(
	// 			"SELECT * FROM users WHERE name = ? AND lastname = ?",
	// 			[name, lastname],
	// 			(err, row) => {
	// 				if (err) return reject(err)
	// 				resolve(row || null)
	// 			},
	// 		)
	// 	})
	// }
	findUser(name, lastname) {
		return this.db
			.prepare("SELECT * FROM users WHERE name = ? AND lastname = ?")
			.get(name, lastname)
	}
}
