import { IRequest } from "../../../common";
import { AbstractRepository } from "../../abstract.repository";
import { Request } from "./request.model";

export class RequestRepository extends AbstractRepository<IRequest> {
  constructor() {
    super(Request);
  }
}

export const requestRepo = new RequestRepository();
