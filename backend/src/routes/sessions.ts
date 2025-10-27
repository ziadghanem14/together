import { Router, Request, Response } from 'express';
import { sessionService } from '../services/sessionService';

const router = Router();

// Create new session
router.post('/', (req: Request, res: Response) => {
  try {
    const { creatorId } = req.body;
    
    if (!creatorId) {
      return res.status(400).json({ error: 'creatorId is required' });
    }

    const session = sessionService.createSession(creatorId);
    
    res.status(201).json({
      sessionId: session.id,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get session info
router.get('/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = sessionService.getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found or expired' });
    }

    res.json({
      id: session.id,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      participantCount: session.participants.size
    });
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({ error: 'Failed to get session' });
  }
});

// Get session participants
router.get('/:sessionId/participants', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const participants = sessionService.getActiveParticipants(sessionId);

    res.json({
      participants: participants.map(p => ({
        userId: p.userId,
        displayName: p.displayName,
        location: p.location,
        lastUpdate: p.lastUpdate,
        isActive: p.isActive
      }))
    });
  } catch (error) {
    console.error('Error getting participants:', error);
    res.status(500).json({ error: 'Failed to get participants' });
  }
});

// Delete session
router.delete('/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const deleted = sessionService.deleteSession(sessionId);

    if (!deleted) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Get server stats (admin/debug)
router.get('/admin/stats', (req: Request, res: Response) => {
  try {
    const stats = sessionService.getSessionStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;

