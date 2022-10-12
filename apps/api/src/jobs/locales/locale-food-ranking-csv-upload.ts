import path from 'node:path';

import type { Job } from 'bullmq';
import type { Transaction } from 'sequelize';
import { parse } from 'fast-csv';
import fs from 'fs-extra';
import { camelCase } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import { FixedFoodRanking, FoodLocalList } from '@intake24/db';

import BaseJob from '../job';

export type CSVRow = {
  foodCode: string;
  sortingPriority: number;
};

const requiredFields = ['foodCode', 'sortingPriority'];

function camelCaseHeaders(headers: (string | undefined | null)[]): string[] {
  return headers.map((header) => {
    return header ? camelCase(header) : '';
  });
}

export default class FoodRankingCsvUpload extends BaseJob<'FoodRankingCsvUpload'> {
  readonly name = 'FoodRankingCsvUpload';

  private readonly db;

  private file!: string;

  constructor({ logger, db }: Pick<IoC, 'logger' | 'db'>) {
    super({ logger });

    this.db = db;
  }

  public async run(job: Job): Promise<void> {
    this.init(job);

    this.file = path.resolve(this.params.file);

    this.logger.debug('Job started.');

    const fileExists = await fs.pathExists(this.file);
    if (!fileExists) throw new Error(`Missing file (${this.file}).`);

    await this.db.system.transaction(async (tx) => {
      await this.deleteRows(tx);
      await this.uploadImpl(tx);
    });

    this.logger.debug('Job finished.');
  }

  private async deleteRows(tx: Transaction) {
    await FixedFoodRanking.destroy({
      where: { localeId: this.params.localeCode },
      transaction: tx,
    });
  }

  private async uploadImpl(tx: Transaction, chunk = 100): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream = fs
        .createReadStream(this.file)
        .pipe(parse({ headers: camelCaseHeaders, trim: true }));

      let parsedRows: CSVRow[] = [];
      const chunkOps: Promise<void>[] = [];

      stream
        .on('data', async (row: CSVRow) => {
          parsedRows.push(row);

          if (chunk > 0 && parsedRows.length === chunk) {
            const chunkRows = parsedRows;
            parsedRows = [];

            try {
              let chunkResolve: (() => void) | undefined;
              const chunkPromise = new Promise<void>((resolve) => {
                chunkResolve = resolve;
              });
              chunkOps.push(chunkPromise);
              await this.validateChunk(chunkRows);
              await this.importChunk(chunkRows, tx);
              chunkResolve?.();
            } catch (err) {
              if (err instanceof Error) {
                stream.destroy(err);
              } else {
                stream.destroy();
              }
              reject(err);
            }
          }
        })
        .on('end', async (records: number) => {
          try {
            await this.validateChunk(parsedRows);
            await this.importChunk(parsedRows, tx);
            await Promise.all(chunkOps);
            resolve();
          } catch (err) {
            if (err instanceof Error) {
              stream.destroy(err);
            } else {
              stream.destroy();
            }
            reject(err);
          }
        })
        .on('error', (err) => reject(err));
    });
  }

  private async validateChunk(chunk: CSVRow[]): Promise<void> {
    if (!chunk.length) return;

    const csvFields = Object.keys(chunk[0]);

    // Check for presence of required fields
    if (requiredFields.some((field) => !csvFields.includes(field)))
      throw new Error(`Missing some of the required fields (${requiredFields.join(',')}).`);

    const foodCodes = chunk.map((item) => item.foodCode);
    const { localeId, localeCode } = this.params;

    const validFoodCodes = (
      await FoodLocalList.findAll({
        where: { localeId: localeCode, foodCode: foodCodes },
      })
    ).map((row) => row.foodCode);

    const invalidFoodCodes = foodCodes.filter((code) => !validFoodCodes.includes(code));

    if (invalidFoodCodes.length > 0) {
      throw new Error(
        `Following food codes are not valid for locale ${localeId} (${localeCode}): ${invalidFoodCodes.join(
          ', '
        )} `
      );
    }
  }

  private async importChunk(rows: CSVRow[], tx: Transaction): Promise<void> {
    if (!rows.length) return;

    const records = rows.map((row) => ({
      localeId: this.params.localeCode,
      foodCode: row.foodCode,
      rank: row.sortingPriority,
    }));

    await FixedFoodRanking.bulkCreate(records, { transaction: tx });
  }
}
