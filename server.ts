import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { runAllScrapers } from './server/scraperEngine.js';
import { getSupabaseAdmin } from './server/supabaseAdmin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Cron API za sinhronizaciju
  app.all('/api/cron/sync', async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    // Validate secret if configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const result = await runAllScrapers();
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin API: Promote to PRO
  app.post('/api/admin/users/:id/pro', async (req, res) => {
    try {
      // Very basic security check for sandbox environment
      const adminEmail = req.body.adminEmail;
      if (adminEmail !== (process.env.ADMIN_EMAIL || 'admin@arbitraza.rs')) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const { id } = req.params;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 dana
      
      const { data, error } = await getSupabaseAdmin()
        .from('profiles')
        .update({ is_pro: true, pro_expires_at: expiresAt.toISOString() })
        .eq('id', id)
        .select();

      if (error) throw error;
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin API: Ban
  app.post('/api/admin/users/:id/ban', async (req, res) => {
    try {
      const adminEmail = req.body.adminEmail;
      if (adminEmail !== (process.env.ADMIN_EMAIL || 'admin@arbitraza.rs')) return res.status(403).json({ error: 'Forbidden' });

      const { id } = req.params;
      const { data, error } = await getSupabaseAdmin()
        .from('profiles')
        .update({ status: 'banned', is_pro: false })
        .eq('id', id)
        .select();

      if (error) throw error;
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin API: Free
  app.post('/api/admin/users/:id/free', async (req, res) => {
    try {
      const adminEmail = req.body.adminEmail;
      if (adminEmail !== (process.env.ADMIN_EMAIL || 'admin@arbitraza.rs')) return res.status(403).json({ error: 'Forbidden' });

      const { id } = req.params;
      const { data, error } = await getSupabaseAdmin()
        .from('profiles')
        .update({ is_pro: false, status: 'active', pro_expires_at: null })
        .eq('id', id)
        .select();

      if (error) throw error;
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware za razvoj
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
