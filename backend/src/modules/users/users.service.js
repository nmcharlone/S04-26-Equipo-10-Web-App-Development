export default class UsersService {
	constructor(repository) {
		this.repository = repository
	}

	async listUsers() {
		return this.repository.listUsers()
	}

	async getUserById(id) {
		return this.repository.getUserById(id)
	}
}