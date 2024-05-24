import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import authRouter from './routes/authRoute';
import cors from 'cors';
import fs from 'fs';
import http from 'http';
import https from 'https';
import spreadSheetRouter from './routes/spreadsheetRoute';
import cookieParser from 'cookie-parser';

const privateKey = fs.readFileSync('../cert.key', 'utf8');
const certificate = fs.readFileSync('../cert.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({ credentials: true, origin: 'https://localhost:8000' }));

declare module 'express' {
  interface Request {
    requestTime: string;
  }
}

app.use((req: Request, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/auth', authRouter);
app.use('/api/sheets', spreadSheetRouter);

const httpsServer = https.createServer(credentials, app);
export default httpsServer;
