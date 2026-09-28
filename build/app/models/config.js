import { ConfigSchema } from '#database/schema';
import { compose } from '@adonisjs/core/helpers';
import { Auditable } from '@filipebraida/adonis-auditing';
export default class Config extends compose(ConfigSchema, Auditable) {
}
export const ConfigID = {
    ID_TERM: 301,
    ID_TERM_PDPA: 302,
    ID_TERM_PDPA_FILE: 305,
    ID_SLA_NEW: 511,
    ID_SLA_IN_PROGRESS: 521,
    ID_SLA_IN_PROGRESS_EXTEND: 522,
    ID_SLA_INVESTIGATING_NORMAL: 531,
    ID_SLA_INVESTIGATING_NORMAL_EXTEND: 532,
    ID_SLA_INVESTIGATING_COMPLEX: 535,
    ID_SLA_INVESTIGATING_COMPLEX_EXTEND: 536,
};
//# sourceMappingURL=config.js.map