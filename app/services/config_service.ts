import Config, { ConfigID } from '#models/config'

export class ConfigService {
  static async getConfigTerm() {
    const data = await Config.query()
      .whereIn('id', [ConfigID.ID_TERM, ConfigID.ID_TERM_PDPA, ConfigID.ID_TERM_PDPA_FILE])
      .orderBy('id')
      .select('value', 'updated_at')
    const model = {
      term: data[0].$attributes.value,
      pdpa: data[1].$attributes.value,
      pdpa_file_name: data[2].$attributes.value,
      updated_at: data[2].updatedAt?.toISO() ?? null,
    }
    return model
  }
}
