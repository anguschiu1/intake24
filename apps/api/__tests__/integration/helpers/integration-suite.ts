import { Express } from 'express';
import fs from 'fs-extra';
import app from '@intake24/api/app';
import ioc from '@intake24/api/ioc';
import foodIndex from '@intake24/api/food-index';
import { initDatabase, initFiles, wipeRedis, MockData, MockFiles } from '.';
import sharedTests, { SharedTests } from './shared-tests';

export type Bearers = Record<'superuser' | 'user' | 'respondent', string>;

const { config, logger, db, cache, rateLimiter, scheduler, session } = ioc.cradle;

class IntegrationSuite {
  public config;

  public logger;

  public db;

  public cache;

  public rateLimiter;

  public scheduler;

  public session;

  public app!: Express;

  public data!: MockData;

  public files!: MockFiles;

  public bearer!: Bearers;

  public sharedTests!: SharedTests;

  constructor() {
    this.config = config;
    this.logger = logger;
    this.db = db;
    this.cache = cache;
    this.rateLimiter = rateLimiter;
    this.scheduler = scheduler;
    this.session = session;
  }

  /**
   * Initialize integration suite
   *
   * @memberof IntegrationSuite
   */
  public async init() {
    // Wipe Redis store data
    await wipeRedis();

    // Boot up application with all dependencies
    this.app = await app({ config: this.config, logger: this.logger });

    // Fill in database with initial data
    this.data = await initDatabase();

    // Grab mock files
    this.files = await initFiles();

    this.sharedTests = sharedTests(this);
  }

  /**
   * Close all I/O connections
   * - databases
   * - redis clients (cache / queue / rate limiter / session)
   * - worker threads (food index)
   *
   * @memberof IntegrationSuite
   */
  public async close() {
    // Close redis store connections
    this.cache.close();
    this.rateLimiter.close();
    this.session.close();

    // Close redis queue connections
    await this.scheduler.close();

    await this.db.foods.close();
    await this.db.system.close();
    await foodIndex.close();

    const { downloads, uploads, images } = this.config.filesystem.local;
    await Promise.all(
      [downloads, uploads, images].map((folder) => fs.rm(folder, { recursive: true }))
    );
  }
}

export default new IntegrationSuite();
