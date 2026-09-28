import { BaseTransformer } from '@adonisjs/core/transformers'
import type ComplaintFile from '#models/complaint_file'
import drive from '@adonisjs/drive/services/main'
import { signedUrlFor } from '@adonisjs/core/services/url_builder'

export default class ComplaintFileTransformer extends BaseTransformer<ComplaintFile> {
  toObject() {
    return this.pick(this.resource, ['id', 'file'])
  }

  async toAdminObjectWithStreamUrl() {
    return {
      ...this.pick(this.resource, ['id', 'file']),
      fileUrl: signedUrlFor(
        'admin.complaints.file',
        { filename: this.resource.file },
        { expiresIn: '1 days' } //, prefixUrl: appUrl
      ),
    }
  }
  async toAdminObjectWithSignedUrl() {
    return {
      ...this.pick(this.resource, ['id', 'file']),
      fileUrl: await drive.use('fileApi').getSignedUrl(this.resource.file),
    }
  }
}
