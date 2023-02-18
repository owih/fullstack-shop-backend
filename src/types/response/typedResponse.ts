import { Send } from 'express-serve-static-core';
import { Response } from 'express';

export interface TypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}
