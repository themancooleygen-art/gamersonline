const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
async function pollQueue(queueKey) { const ticketId = await redis.rpop(queueKey); if (!ticketId) return null; return ticketId; }
async function main() {
  console.log("GamersOnline worker started");
  setInterval(async () => {
    const queues = ["queue:NA:SOLO", "queue:NA:DUO", "queue:NA:FIVE_STACK", "queue:EU:SOLO"];
    for (const queue of queues) {
      const ticketId = await pollQueue(queue);
      if (ticketId) {
        console.log(`Pulled ticket ${ticketId} from ${queue}`);
        console.log("Match allocator placeholder: group compatible tickets, create match, assign server.");
      }
    }
  }, 3000);
}
main().catch((err) => { console.error(err); process.exit(1); });
