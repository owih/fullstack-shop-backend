import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 9000;
const app: Express = express();

app.use(express.json())
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(9000, () => {
  console.log(`Starting Server on Port ${port}`);
});
