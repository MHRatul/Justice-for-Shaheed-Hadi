import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });

// Routes

// Get configuration
app.get('/api/config', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM config WHERE id = 1');
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      // Return default config
      res.json({
        title: 'হাদির হত্যার বিচারের দাবি',
        description: 'শহীদ ওসমান হাদি হত্যার বিচারহীনতার সময়কাল',
        targetDate: '2024-07-18T00:00:00'
      });
    }
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

// Update configuration (admin only - add authentication in production)
app.put('/api/config', async (req, res) => {
  const { title, description, targetDate } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE config SET title = ?, description = ?, targetDate = ?, updatedAt = NOW() WHERE id = 1',
      [title, description, targetDate]
    );

    if (result.affectedRows === 0) {
      // Insert if not exists
      await pool.query(
        'INSERT INTO config (id, title, description, targetDate) VALUES (1, ?, ?, ?)',
        [title, description, targetDate]
      );
    }

    res.json({ message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

// Track page views (optional analytics)
app.post('/api/analytics/view', async (req, res) => {
  try {
    await pool.query('INSERT INTO page_views (viewedAt) VALUES (NOW())');
    res.json({ message: 'View tracked' });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// Get analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const [totalViews] = await pool.query('SELECT COUNT(*) as total FROM page_views');
    const [todayViews] = await pool.query(
      'SELECT COUNT(*) as today FROM page_views WHERE DATE(viewedAt) = CURDATE()'
    );

    res.json({
      totalViews: totalViews[0].total,
      todayViews: todayViews[0].today
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route - ADD THIS
app.get('/', (req, res) => {
  res.json({
    message: 'Trial of Shaheed Hadi API',
    status: 'running',
    endpoints: [
      'GET /health - Health check',
      'GET /api/config - Get countdown configuration',
      'PUT /api/config - Update configuration',
      'POST /api/analytics/view - Track page view',
      'GET /api/analytics - Get analytics data'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});