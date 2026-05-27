export default class StatusesService {
	constructor(repo) {
		this.repo = repo
	}

	async listStatuses() {
		return this.repo.listStatuses()
	}
}
