export interface INotificationProvider {
  /**
   *
   * @param token: like fcm token in case using firebase service
   * @param title: contains notification title
   * @param data: contains notification body
   */
  send(token: string, data: { title: string; body: string }): Promise<void>;
  sendAll(
    tokens: string[],
    data: { title: string; body: string },
  ): Promise<void>;
}
