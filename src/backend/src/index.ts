import express, { Express } from 'express';
import router from './routes/routes';
const cors = require('cors');
const app: Express = express();

// Middleware to parse JSON requests
app.use(cors());
app.use(express.json());
app.use('/',router);

// Exporting app using ES module syntax
export default app;
