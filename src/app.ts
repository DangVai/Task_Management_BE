import express from 'express';
import authRoute from './modules/auth/auth.route.js';

const app = express();
const API_BASE = "/api/v1";
app.use(express.json());

app.use(`${API_BASE}/auth`, authRoute);

export default app;
