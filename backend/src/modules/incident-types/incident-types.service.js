import { ConflictError, NotFoundError } from "../../errors/errors.js"
import { parseIdParam, validateCatalogName } from "./incident-types.validations.js"

function mapDbError(err) {
	const msg = err?.message || String(err)
	if (msg.includes("SQLITE_CONSTRAINT")) {
		if (msg.includes("UNIQUE")) {
			return new ConflictError("Ya existe un registro con ese nombre")
		}
		return new ConflictError(
			"No se puede completar la operación: el registro está en uso",
		)
	}
	return err
}

export default class IncidentTypesService {
	constructor(repo) {
		this.repo = repo
	}

	async listIncidentTypes() {
		return this.repo.listIncidentTypes()
	}

	async createIncidentType(body) {
		const name = validateCatalogName(body)
		try {
			return await this.repo.insertIncidentType(name)
		} catch (e) {
			throw mapDbError(e)
		}
	}

	async updateIncidentType(idParam, body) {
		const id = parseIdParam(idParam)
		const name = validateCatalogName(body)
		try {
			const { changes } = await this.repo.updateIncidentType(id, name)
			if (!changes) {
				throw new NotFoundError("Tipo de incidente no encontrado")
			}
			return { id, name }
		} catch (e) {
			throw mapDbError(e)
		}
	}

	async deleteIncidentType(idParam) {
		const id = parseIdParam(idParam)
		try {
			const { changes } = await this.repo.deleteIncidentType(id)
			if (!changes) {
				throw new NotFoundError("Tipo de incidente no encontrado")
			}
		} catch (e) {
			throw mapDbError(e)
		}
	}
}
