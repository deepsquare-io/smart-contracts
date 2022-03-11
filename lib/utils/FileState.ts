import { existsSync, readFileSync, writeFileSync } from 'fs';
import { get, set } from 'lodash';

export default class FileState<T extends Partial<Record<string, any>> = Partial<Record<string, any>>> {
  constructor(private readonly path: string) {
    if (!existsSync(this.path)) {
      this.write({});
    }
  }

  read(): T {
    return JSON.parse(readFileSync(this.path, { encoding: 'utf-8' }));
  }

  write(newState: Partial<T>) {
    let prev = {};

    if (existsSync(this.path)) {
      prev = this.read();
    }

    const data = JSON.stringify({ ...prev, ...newState }, undefined, 2);
    writeFileSync(this.path, data);
  }

  get(key: string) {
    return get(this.read(), key);
  }

  set(key: string, value: any) {
    return this.write(set(this.read(), key, value));
  }
}
