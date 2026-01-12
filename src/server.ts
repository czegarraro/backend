/**
 * Server Entry Point
 */
import { createApp } from "./app";
import { database } from "./config/database";
import { config } from "./config/env";

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Try to connect to MongoDB (optional - server will start even if this fails)
    try {
      await database.connect();
    } catch (dbError) {
      console.warn(
        "⚠️  MongoDB connection failed - server will start without database"
      );
      console.warn("⚠️  Authentication will still work with demo credentials");
      console.warn("⚠️  Problem data endpoints will not be available");
    }

    // Create Express app
    const app = createApp();

    // Start listening
    const server = app.listen(config.server.port, () => {
      console.log("");
      console.log("🚀 ========================================");
      console.log("🚀  Dynatrace Problems API Server");
      console.log("🚀 ========================================");
      console.log(`📡 Server running on port ${config.server.port}`);
      console.log(`🌍 Environment: ${config.server.env}`);
      console.log(
        `🔗 API Base URL: http://localhost:${config.server.port}/api/v1`
      );
      console.log(
        `💚 Health Check: http://localhost:${config.server.port}/api/v1/health`
      );
      console.log("🚀 ========================================");
      console.log("");
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log("✅ HTTP server closed");

        try {
          await database.close();
          console.log("✅ Database connection closed");
          process.exit(0);
        } catch (error) {
          console.error("❌ Error during shutdown:", error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error("❌ Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught errors
    process.on("uncaughtException", (error) => {
      console.error("❌ Uncaught Exception:", error);
      gracefulShutdown("UNCAUGHT_EXCEPTION");
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
      gracefulShutdown("UNHANDLED_REJECTION");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
