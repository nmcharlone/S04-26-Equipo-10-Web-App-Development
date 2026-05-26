export default class RootCausesRepository {
	constructor(db) {
		this.db = db
	}

	getRootCauses() {
		const query = `
			SELECT id, name
			FROM root_cause
			ORDER BY id
		`

		return this.db.prepare(query).all()
	}
}