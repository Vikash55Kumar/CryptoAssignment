import dotenv from "dotenv";
import connectDB from "./db/database.js";
import { app } from "./app.js";
import { Redis } from "ioredis";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

dotenv.config({
    path: './env'
});

const client = new Redis(); // Redis client using ioredis
const server = createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
    cors: {
        origin: ["http://localhost:5173"], // Frontend origin
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Connect to MongoDB
connectDB()
    .then(() => {
        // Start the server
        server.listen(process.env.PORT || 4000, () => {
            console.log(`Server is running at port ${process.env.PORT}`);
        });

        // Socket.IO connection handling
        io.on("connection", (socket) => {
            console.log("Socket.IO connection established");

            // Send cached data to the client immediately
            client.get("crypto_prices", (err, data) => {
                if (err) {
                    console.error("Redis get error:", err);
                    return;
                }
                if (data) {
                    console.log("Sending cached data to the client");
                    socket.emit("crypto_prices", JSON.parse(data));
                }
            });

            // Handle client disconnection
            socket.on("disconnect", () => {
                console.log("Socket.IO client disconnected");
            });
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed!!", err);
    });

// Export Redis client and Socket.IO
export { client, io };












// import dotenv from "dotenv";
// import connectDB from "./db/database.js";
// import { app } from "./app.js";
// import { Redis } from "ioredis";
// import { WebSocketServer } from "ws";
// import http from "http";  // Import http to create a server

// dotenv.config({
//     path: './env'
// });

// const wss = new WebSocketServer({ noServer: true });
// const client = new Redis(); // Redis client using ioredis

// // Create HTTP server from Express app
// const server = http.createServer(app);

// // Connect to MongoDB
// connectDB()
//     .then(() => {
//         server.listen(process.env.PORT || 4000, () => {
//             console.log(`Server is running at port ${process.env.PORT}`);
//         });

//         // WebSocket logic
//         wss.on('connection', (ws) => {
//             console.log('New WebSocket connection established');

//             // Fetch data from Redis and send it to client immediately
//             client.get('crypto_prices', (err, data) => {
//                 if (err) {
//                     console.error('Redis get error:', err);
//                     return;
//                 }
//                 if (data) {
//                     console.log('Sending cached data to the client');
//                     ws.send(data); // Send cached data to client
//                 }
//             });

//             // Handle WebSocket disconnection
//             ws.on('close', () => {
//                 console.log('WebSocket connection closed');
//             });
//         });

//         // WebSocket upgrade handling
//         server.on('upgrade', (request, socket, head) => {
//             wss.handleUpgrade(request, socket, head, (ws) => {
//                 wss.emit('connection', ws, request);
//             });
//         });

//     })
//     .catch((err) => {
//         console.log("MongoDB connection failed!!", err);
//     });

// export { client, wss };






















// fetchCryptoPrices()



// import dotenv from "dotenv";
// import connectDB from "./db/database.js";
// import { app } from "./app.js";
// import { createClient } from "redis";

// dotenv.config({
//     path: './env',
// });

// // Initialize Redis Client
// const redisClient = createClient({
//     url: process.env.REDIS_URL || "redis://127.0.0.1:6379", // Use Redis URL from environment or default to localhost
// });

// redisClient.on("error", (err) => {
//     console.error("Redis Client Error:", err);
// });

// // Connect to MongoDB and Redis, then start the server
// (async () => {
//     try {
//         await connectDB();
//         console.log("MongoDB connected successfully!");

//         await redisClient.connect();
//         console.log("Redis connected successfully!");

//         const port = process.env.PORT || 4000;
//         app.listen(port, () => {
//             console.log(`Server is running at port ${port}`);
//         });
//     } catch (err) {
//         console.error("Initialization failed:", err);
//     }
// })();

// // Export Redis client for use in other files
// export { redisClient };

