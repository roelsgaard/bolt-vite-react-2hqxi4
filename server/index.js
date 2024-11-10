import express from 'express';
import cors from 'cors';
import { router as matchesRouter } from './routes/matches.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/matches', matchesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});