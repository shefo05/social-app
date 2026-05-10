export interface ICacheProvider {
  get(key: string): Promise<string | null>;
  set(key: string, value: string | number, ttlSec: number): Promise<void>;
  delete(key: string): Promise<void>;

  /**
   *
   * @param key >> "userId:FCM" >>[fcmToken1,fcmToken2,...]
   * @param value >> fcm token from firebase
   */
  addToSet(key: string, value: string): Promise<void>;

  rmSet(key: string, value: string): Promise<boolean>;

  getAllSet(key: string): Promise<string[] | null>;
}
