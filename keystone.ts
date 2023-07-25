import { config } from '@keystone-6/core';
import { lists } from './schema';
import { withAuth, session } from './auth';
import { seedData } from './seeder';
import { gql } from 'graphql-tag';

export default withAuth(
  config({
    db: {
      provider: 'mysql',
      url: 'mysql://root:yudha@localhost:3306/learnkeystone6',
      enableLogging: true,
      idField: { kind: 'autoincrement' },
      onConnect: async context => {
        const isEmpty = await context.db.Company_Information.count();

        if (isEmpty === 0) {
          await seedData(context);
        }
      },
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
