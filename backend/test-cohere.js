// Simple test to check if Cohere import works
import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";

dotenv.config();

console.log("Testing Cohere import...");
console.log("COHERE_API_KEY exists:", !!process.env.COHERE_API_KEY);

try {
  const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
  });
  console.log("✅ Cohere client created successfully");
} catch (error) {
  console.error("❌ Error creating Cohere client:", error.message);
}

console.log("Test complete");