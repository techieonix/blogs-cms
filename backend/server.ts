import express from 'express';
import { Request, Response } from 'express';
import userRoutes from './routes/user';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic route
interface HelloRequest extends Request {}
interface HelloResponse extends Response {}

app.get('/', (req: HelloRequest, res: HelloResponse) => {
    res.send('Hello, Express server is running!');
});

app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});