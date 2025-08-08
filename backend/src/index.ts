import express from "express";
import userRouter from "./routes/user.route.js";
import chatGPTRouter from "./routes/chatGPT.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', userRouter)
app.use('/api', chatGPTRouter)

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

console.log("Hello world");
