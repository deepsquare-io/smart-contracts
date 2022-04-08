import { sync as glob } from 'fast-glob';
import { readFile } from 'fs/promises';
import { config } from 'hardhat';
import { resolve } from 'path';

const root = resolve(config.typechain.outDir);
const files = glob(`${root}/**/*.ts`);

const mappings = {
  Event: '@ethersproject/contracts',
  EventFilter: '@ethersproject/contracts',
};

async function process(file: string) {
  const raw = await readFile(file, { encoding: 'utf-8' });

  // extract imports
  const importsMap = new Map<string, string[]>();

  for (const m of raw.matchAll(/^import type (.*) from "(.*)";$/gm)) {
    const key = m[2] + ':type';
    const imports = m[1]
      .replace(/^{ /, '')
      .replace(/ }/, '')
      .trim()
      .split(',')
      .map((i) => i.trim())
      .filter((i) => !!i);

    importsMap.set(key, [...(importsMap.get(key) ?? []), ...imports]);
  }

  console.log(importsMap);
}

process(files[0]);
