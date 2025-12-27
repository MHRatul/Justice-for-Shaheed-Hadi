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
// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Trial of Shaheed Hadi API',
    status: 'running',
    endpoints: [
      'GET /health - Health check',
      'GET /api/config - Get countdown configuration',
      'PUT /api/config - Update configuration',
      'GET /api/news - Get all active news',
      'GET /api/news/:id - Get single news item',
      'POST /api/news - Create news item',
      'PUT /api/news/:id - Update news item',
      'DELETE /api/news/:id - Delete news item',
      'PATCH /api/news/:id/toggle - Toggle news active status',
      'POST /api/analytics/view - Track page view',
      'GET /api/analytics - Get analytics data'
    ]
  });
});

// ========== NEWS ROUTES ==========

// Get all active news
app.get('/api/news', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM news WHERE isActive = 1 ORDER BY displayOrder ASC, createdAt DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get single news item
app.get('/api/news/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'News not found' });
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Create news item
app.post('/api/news', async (req, res) => {
  const { content, isActive = 1, displayOrder = 0 } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO news (content, isActive, displayOrder) VALUES (?, ?, ?)',
      [content, isActive, displayOrder]
    );

    res.json({
      message: 'News created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ error: 'Failed to create news' });
  }
});

// Update news item
app.put('/api/news/:id', async (req, res) => {
  const { content, isActive, displayOrder } = req.body;
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      'UPDATE news SET content = ?, isActive = ?, displayOrder = ?, updatedAt = NOW() WHERE id = ?',
      [content, isActive, displayOrder, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json({ message: 'News updated successfully' });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: 'Failed to update news' });
  }
});

// Delete news item
app.delete('/api/news/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM news WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

// Toggle news active status
app.patch('/api/news/:id/toggle', async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE news SET isActive = NOT isActive, updatedAt = NOW() WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json({ message: 'News status toggled successfully' });
  } catch (error) {
    console.error('Error toggling news:', error);
    res.status(500).json({ error: 'Failed to toggle news status' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});