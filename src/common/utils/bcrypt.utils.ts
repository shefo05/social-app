import * as bcrypt from "bcrypt";

export async function hash(password: string) {
  return bcrypt.hash(password, 10);
}

export async function compare(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}
 