import { BaseTransformer } from '@adonisjs/core/transformers';
import drive from '@adonisjs/drive/services/main';
import { signedUrlFor } from '@adonisjs/core/services/url_builder';
export default class ComplaintFileTransformer extends BaseTransformer {
    toObject() {
        return this.pick(this.resource, ['id', 'file']);
    }
    async toAdminObjectWithStreamUrl() {
        return {
            ...this.pick(this.resource, ['id', 'file']),
            fileUrl: signedUrlFor('admin.complaints.file', { filename: this.resource.file }, { expiresIn: '1 days' }),
        };
    }
    async toAdminObjectWithSignedUrl() {
        return {
            ...this.pick(this.resource, ['id', 'file']),
            fileUrl: await drive.use('fileApi').getSignedUrl(this.resource.file),
        };
    }
}
//# sourceMappingURL=complaint_file_transformer.js.map