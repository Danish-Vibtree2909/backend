import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

// Define the middleware function
export const logRoute = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl} `);
  next();
};
