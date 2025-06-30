const { MongoClient } = require('mongodb');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const data = JSON.parse(event.body);
    data.createdAt = new Date().toISOString();
    
    const result = await db.collection('submissions').insertOne(data);
    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Feedback submitted successfully',
        id: result.insertedId 
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to submit feedback',
        details: error.message 
      }),
    };
  }
};