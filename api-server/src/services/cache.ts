import ms from 'ms';
import type { IoC } from '@/ioc';
import RedisStatic, { Redis, RedisOptions } from 'ioredis';

export default class Cache {
  private prefix = 'cache:it24';

  private env;

  private config: RedisOptions;

  private logger;

  private redis!: Redis;

  constructor({ config, logger }: Pick<IoC, 'config' | 'logger'>) {
    this.env = config.app.env;
    this.config = config.cache.redis;
    this.logger = logger;
  }

  getPrefix(): string {
    return this.prefix;
  }

  /**
   * Initialize Redis cache connection
   *
   * @memberof Cache
   */
  init(): void {
    this.redis = new RedisStatic(this.config);

    this.logger.info(`Cache connection has been loaded.`);
  }

  /**
   * Close Redis cache connection
   *
   * @memberof Cache
   */
  close(): void {
    this.redis.disconnect();

    this.logger.info(`Cache connection has been closed.`);
  }

  /**
   * Flush cache data
   *
   * @returns {Promise<boolean>}
   * @memberof Cache
   */
  async flush(): Promise<boolean> {
    const keys = await this.redis.keys(this.prefix);
    const result = await this.redis.del(keys);

    return !!result;
  }

  /**
   * Flush whole redis store
   * This may include other parts if system if using same redis instance:
   * 1) cache data
   * 2) queue data
   *
   * @returns {Promise<void>}
   * @memberof Cache
   */
  async flushAll(): Promise<boolean> {
    await this.redis.flushall();

    return true;
  }

  /**
   * Retrieve item from cache by given key
   *
   * @template T
   * @param {string} key
   * @returns {(Promise<T | null>)}
   * @memberof Cache
   */
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(`${this.prefix}:${key}`);

    return data ? (JSON.parse(data) as T) : null;
  }

  /**
   * Check if item exists in cache
   *
   * @param {string} key
   * @returns {Promise<boolean>}
   * @memberof Cache
   */
  async has(key: string): Promise<boolean> {
    return !!(await this.redis.exists(`${this.prefix}:${key}`));
  }

  /**
   * Store item in cache, for given time optionally
   *
   * @param {string} key
   * @param {*} value
   * @param {(number | string)} [expiresIn] ('ms' string format or seconds)
   * @returns {Promise<boolean>}
   * @memberof Cache
   */
  async set(key: string, value: any, expiresIn?: number | string): Promise<boolean> {
    const args: [string, string, string?, number?] = [
      `${this.prefix}:${key}`,
      JSON.stringify(value),
    ];
    if (expiresIn)
      args.push('px', typeof expiresIn === 'string' ? ms(expiresIn) : expiresIn * 1000);

    const result = this.redis.set(...args);

    return !!result;
  }

  /**
   * Remove item from cache
   *
   * @returns {Promise<boolean>}
   * @memberof Cache
   */
  async forget(key: string | string[]): Promise<boolean> {
    const keysToDelete = (Array.isArray(key) ? key : [key]).map((item) => `${this.prefix}:${item}`);
    const result = await this.redis.del(keysToDelete);

    return !!result;
  }

  /**
   * Get data from cache if available
   * If not in cache, fresh data are fetched by provided callback stored in cache
   *
   * @template T
   * @param {string} key
   * @param {(number | string)} expiresIn ('ms' string format or seconds)
   * @param {() => Promise<T>} getData
   * @returns {Promise<T>}
   * @memberof Cache
   */
  async remember<T>(
    key: string,
    expiresIn: number | string,
    getData: () => Promise<T>
  ): Promise<T> {
    const cachedData = await this.get<T>(key);
    if (this.env !== 'test' && cachedData !== null) return cachedData;

    const freshData = await getData();
    await this.set(key, freshData, expiresIn);

    return freshData;
  }

  /**
   * Get data from cache if available
   * If not in cache, fresh data are fetched by provided callback stored in cache
   *
   * @template T
   * @param {string} key
   * @param {() => Promise<T>} getData
   * @returns {Promise<T>}
   * @memberof Cache
   */
  async rememberForever<T>(key: string, getData: () => Promise<T>): Promise<T> {
    const cachedData = await this.get<T>(key);
    if (this.env !== 'test' && cachedData !== null) return cachedData;

    const freshData = await getData();
    await this.set(key, freshData);

    return freshData;
  }
}
