const dbConfig = {
  synchronize: false,
  migrationsTableName: 'custom_migration_table',
  migrations: ['migration/*.js'],
  cli: {
    migrationsDir: 'migration',
  },
};
switch (process.env.NODE_ENV) {
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: ['**/*.entity.js'],
      migrationsRun: true,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    break;
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;

  default:
    throw new Error('Unknown enviroment');
    break;
}

module.exports = dbConfig;
