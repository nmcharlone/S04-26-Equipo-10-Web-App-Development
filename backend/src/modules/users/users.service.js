import bcrypt from "bcrypt"
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
	async createUser(userData) {
		const { password } = userData

		const hashedPassword = await bcrypt.hash(password, 10)

		const userToCreate = {
			...userData,
			password: hashedPassword,
		}

		return this.repository.createUser(userToCreate)
	}
	async updateUser(id, userData) {
		const dataToUpdate = { ...userData }

		if (dataToUpdate.password) {
			dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10)
		}

		return this.repository.updateUser(id, dataToUpdate)
	}
}
