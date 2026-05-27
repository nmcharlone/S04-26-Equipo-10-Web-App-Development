export default class RolesService {
	constructor(repo) {
		this.repo = repo
	}

	async listRoles() {
		return this.repo.listRoles()
	}
}
