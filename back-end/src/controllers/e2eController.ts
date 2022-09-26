import { Request, Response } from 'express';
import { truncate } from '../services/e2eService.js';

export async function reset(req: Request, res: Response) {
    await truncate();
    res.sendStatus(201);
}
