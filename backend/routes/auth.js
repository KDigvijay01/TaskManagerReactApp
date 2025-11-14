import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';


const router = Router();


// Signup
router.post('/signup', async (req, res) => {
try {
const { name, email, password, role } = req.body;
const exists = await User.findOne({ email });
if (exists) return res.status(400).json({ message: 'Email already registered' });


const hashed = await bcrypt.hash(password, 10);
const user = await User.create({ name, email, password: hashed, role: role || 'user' });


const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.status(201).json({
token,
user: { id: user._id, name: user.name, email: user.email, role: user.role },
});
} catch (err) {
res.status(500).json({ message: err.message });
}
});


// Signin
router.post('/signin', async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: 'Invalid credentials' });


const valid = await bcrypt.compare(password, user.password);
if (!valid) return res.status(400).json({ message: 'Invalid credentials' });


const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({
token,
user: { id: user._id, name: user.name, email: user.email, role: user.role },
});
} catch (err) {
res.status(500).json({ message: err.message });
}
});


export default router;