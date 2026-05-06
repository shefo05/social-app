export interface ICacheProvider {
  get(key: string): Promise<string |null>;
  set(key: string, value: string |number, ttlSec: number): Promise<void>;
  delete(key: string): Promise<void>;
}
