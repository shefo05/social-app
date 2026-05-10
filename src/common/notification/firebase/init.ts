import * as fs from "node:fs";
import { FirebasePushNotificationProvider } from "./firebase.service";
import path from "node:path";

const config = JSON.parse(
  fs.readFileSync(
    path.resolve(
      "./src/config/social-app-85331-firebase-adminsdk-fbsvc-0f585426e5.json",
    ),
  ) as unknown as string,
);

export const firebasePushNotificationProvider =
  new FirebasePushNotificationProvider(config);
