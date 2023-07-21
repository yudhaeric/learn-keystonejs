// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core';

// to keep this file tidy, we define our schema in a different file
import { lists } from './schema';
import type { StorageConfig } from '@keystone-6/core/types'

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth';

export default withAuth(
  config({
    db: {
      provider: 'mysql',
      url: 'mysql://root:yudha@localhost:3306/article_keystonejs',
      enableLogging: true,
      idField: { kind: 'autoincrement' },
    },
    server: {
      cors: { origin: ['http://localhost:3000'], credentials: true },
      port: 5000,
      maxFileSize: 200 * 1024 * 1024,
      healthCheck: {
        path: '/my-health-check',
        data: () => ({
          status: 'healthy',
          timestamp: Date.now(),
          uptime: process.uptime(),
        }),
      },
    },
    storage: {
      profile_storage: {
        kind: 'local',
        type: 'image',
        generateUrl: path => `http://localhost:5000/images${path}`,
        serverRoute: {
          path: '/images',
        },
        storagePath: 'public/images',
      }
    },
    lists,
    session,
  })
);
