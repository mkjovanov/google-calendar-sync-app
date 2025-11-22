import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth';
import currentUserRoutes from './routes/current-user';
import getPassportSetup from './config/passport';
import calendarRoutes from "./routes/calendar";

const app = express();
const PORT = process.env.PORT!;
const CLIENT_URL = process.env.CLIENT_URL!;

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(getPassportSetup().initialize());

app.use('/auth', authRoutes);
app.use('/current-user', currentUserRoutes);
app.use("/calendar", calendarRoutes);


app.get('/', (_req, res) => res.send('API running'));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
