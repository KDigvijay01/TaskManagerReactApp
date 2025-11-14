import { Router } from 'express';
import Task from '../models/Task.js';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';


const router = Router();


// Create Task
router.post('/', auth, async (req, res) => {
try {
const task = await Task.create({ ...req.body, createdBy: req.user._id });
res.status(201).json(task);
} catch (err) {
res.status(500).json({ message: err.message });
}
});

// Get All Tasks (Paginated)
router.get('/', auth, async (req, res) => {
try {
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };


const total = await Task.countDocuments(filter);
const tasks = await Task.find(filter)
.sort({ createdAt: -1 })
.skip((page - 1) * limit)
.limit(limit);


res.json({ tasks, total, page, pages: Math.ceil(total / limit) });
} catch (err) {
res.status(500).json({ message: err.message });
}
});


// Get Task by ID
router.get('/:id', auth, async (req, res) => {
try {
const task = await Task.findById(req.params.id);
if (!task) return res.status(404).json({ message: 'Task not found' });
if (req.user.role !== 'admin' && !task.createdBy.equals(req.user._id))
return res.status(403).json({ message: 'Access denied' });


res.json(task);
} catch (err) {
res.status(500).json({ message: err.message });
}
});


// Update Task
router.put('/:id', auth, async (req, res) => {
try {
const task = await Task.findById(req.params.id);
if (!task) return res.status(404).json({ message: 'Task not found' });


if (req.user.role !== 'admin' && !task.createdBy.equals(req.user._id))
return res.status(403).json({ message: 'Access denied' });


Object.assign(task, req.body);
await task.save();
res.json(task);
} catch (err) {
res.status(500).json({ message: err.message });
}
});


// Delete Task (Admin Only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
try {
await Task.findByIdAndDelete(req.params.id);
res.json({ message: 'Task deleted successfully' });
} catch (err) {
res.status(500).json({ message: err.message });
}
});


export default router;