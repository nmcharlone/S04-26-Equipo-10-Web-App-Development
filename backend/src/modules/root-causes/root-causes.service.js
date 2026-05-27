export default class RootCausesService {
	constructor(rootCausesRepository) {
		this.rootCausesRepository = rootCausesRepository
	}

	async getRootCauses() {
		return await this.rootCausesRepository.getRootCauses()
	}
}