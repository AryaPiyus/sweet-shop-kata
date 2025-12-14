import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import sweetsRoutes from './routes/sweets.routes';
const app = express();

app.use(helmet());
app.use(cors({
  origin:  'https://sweet-shop-kata-eta.vercel.app/', 
  credentials: true 
}));
app.use(express.json());

app.use('/api/auth' , authRoutes);
app.use('/api/sweets' , sweetsRoutes);

export default app;