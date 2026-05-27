export default class ResolutionsService {
	constructor(ResolutionsRepository) {
		this.ResolutionsRepository = ResolutionsRepository
	}
	async createResolution(incidentId, solution, root_cause_id) {
		return await this.ResolutionsRepository.createResolution(
			incidentId,
			solution,
			root_cause_id,
		)
	}
}
