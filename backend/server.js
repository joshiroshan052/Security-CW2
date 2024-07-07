const express = require("express");
require("dotenv").config({ path: "./config/.env" });
require("./config/db").connectToDB();
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const compression = require("compression");
const { RateLimiterMemory } = require('rate-limiter-flexible');
const winston = require("winston");
const app = express();
const server = require("http").createServer(app);


// Logger Setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});


if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Middleware Setup
app.use(express.json());  // Parse JSON
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"],
      "object-src": ["'none'"],
      "img-src": ["'self'", "data:"],
      "frame-ancestors": ["'none'"],
    },
  },
}));

app.use(xss());  // XSS Protection

app.use(mongoSanitize());  // NoSQL Injection Protection


app.use(hpp());  // HTTP Parameter Pollution Protection


app.use(compression()); // Compress all responses

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, 
});
app.use(limiter);

// Rate Limiter Flexible
const rateLimiter = new RateLimiterMemory({
  points: 100, // 5 requests
  duration: 1, // per second
});

app.use((req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send('Too Many Requests');
    });
});

// Socket.io Setup
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const USER_SOCKET_MAP = new Map();

// Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const userRoute = require("./routes/user");
const chatRoute = require("./routes/chat");
const storyRoute = require("./routes/story");
const User = require("./models/User");

app.use("/auth", authRoute);
app.use("/post", postRoute);
app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/story", storyRoute);

app.get("/test", (req, res) => {
  res.send("Hello from other side");
});

// HSTS Middleware (Force HTTPS)
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

io.on("connect", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("online", async ({ uid }) => {
    USER_SOCKET_MAP.set(socket.id, uid);
    await User.updateOne({ _id: uid }, { $set: { online: true } });
  });
  socket.on("typingon", ({ uid, roomId }) => {
    socket.broadcast.emit(`typinglistenon${roomId}`, uid);
  });
  socket.on("typingoff", ({ uid, roomId }) => {
    socket.broadcast.emit(`typinglistenoff${roomId}`, uid);
  });
  socket.on("disconnect", async () => {
    await User.updateOne(
      { _id: USER_SOCKET_MAP.get(socket.id) },
      { $set: { online: false, lastSeen: Date.now() } }
    );
    USER_SOCKET_MAP.delete(socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running at port: ${process.env.PORT}`);
});
