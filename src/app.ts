import express from 'express';
import authRoute from './modules/auth/auth.route.js';
import taskRoute from './modules/task/task.route.js';

const app = express();
const API_BASE = "/api/v1";
app.use(express.json());

app.use(`${API_BASE}/auth`, authRoute);
app.use(`${API_BASE}/task`, taskRoute);

export default app;
