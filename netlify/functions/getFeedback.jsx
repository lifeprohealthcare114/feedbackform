const { MongoClient } = require('mongodb');

exports.handler = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const feedbacks = await db.collection('submissions')
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    
    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify(feedbacks),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch feedback',
        details: error.message 
      }),
    };
  }
};