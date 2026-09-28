import env from '#start/env';
import app from '@adonisjs/core/services/app';
import { defineConfig, services } from '@adonisjs/drive';
import { servicesExtended } from '#drivers/fileApi/driver';
const driveConfig = defineConfig({
    default: env.get('DRIVE_DISK'),
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
            });
            return fileApiDisk;
        })(),
    },
});
export default driveConfig;
//# sourceMappingURL=drive.js.map