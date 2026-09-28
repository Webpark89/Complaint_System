import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, services } from '@adonisjs/drive'
import { servicesExtended } from '#drivers/fileApi/driver'

// export declare const servicesExtended: {
//   fileApi: (config: FileApiDriverOptions) => ServiceConfigProvider<() => FileApiDriver>
// }

const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK'),
  /**
   * The services object can be used to configure multiple file system
   * services each using the same or a different driver.
   */
  services: {
    fs: services.fs({
      location: app.makePath('storage'),
      serveFiles: true,
      routeBasePath: '/uploads',
      visibility: 'public',
    }),
    fileApi: (() => {
      const fileApiDisk = servicesExtended.fileApi({
        bucket: env.get('FILE_API_BUCKET'),
        endpoint: env.get('FILE_API_ENDPOINT'),
        client_id: env.get('FILE_API_CLIENT_ID'),
        client_secret: env.get('FILE_API_CLIENT_SECRET'),
        visibility: 'public',
      }) as any

      return fileApiDisk
    })(),
    // s3: services.s3({
    //   credentials: {
    //     accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
    //     secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
    //   },
    //   region: env.get('AWS_REGION'),
    //   bucket: env.get('S3_BUCKET'),
    //   visibility: 'public',
    //   endpoint: env.get('S3_ENDPOINT'),
    //   forcePathStyle: env.get('AWS_S3_FORCE_PATH_STYLE'),
    // }),
    //mc alias set local http://localhost:9000 admin password123
    //mc admin accesskey ls local --all
  },
})

export default driveConfig
