import express from 'express'
import seedDemo from '../utils/seed.js'

const router = express.Router()

// Caution: exposed for local/demo use only
router.post('/seed', async (req, res) => {
  try {
    const result = await seedDemo()
    res.json({ message: 'Seeded demo data', result })
  } catch (err) {
    console.error('Seed error', err)
    res.status(500).json({ message: 'Seed failed', error: err.message })
  }
})

export default router
