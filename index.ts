import express, { Express, Request, Response } from 'express';

const app: Express = express();
// const port = process.env.PORT;
const port = 9000;

app.use(express.json())
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(9000, () => {
  console.log(`Starting Server on Port ${port}`);
});
