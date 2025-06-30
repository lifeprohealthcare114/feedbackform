const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://feedback-admin:YOUR_PASSWORD@cluster0.66ekdma.mongodb.net/feedback_db?retryWrites=true&w=majority";

async function test() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully");
    const db = client.db();
    const result = await db.collection('submissions').insertOne({ 
      test: true,
      timestamp: new Date() 
    });
    console.log("Insert result:", result);
    
    // Verify by reading back
    const docs = await db.collection('submissions').find({}).toArray();
    console.log("All documents:", docs);
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await client.close();
  }
}
test();