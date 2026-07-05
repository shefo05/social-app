/** Socket payload for presence:online / presence:offline. See
 * realtime.gateway.ts - emitted only to the affected user's friends. */
export interface PresenceEvent {
  userId: string;
}
