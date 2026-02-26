import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await register(name, email, password);
            toast.success('Account created successfully!', {
                style: { background: '#1a1a2e', color: '#fefcf7', border: '1px solid rgba(224, 169, 109, 0.3)' },
            });
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md px-4"
            >
                <div className="card p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-display font-bold text-gold-500">Create Account</h1>
                        <p className="text-charcoal-300 mt-2">Join the Al-Maaz family</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm text-charcoal-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                id="register-name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-charcoal-300 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                id="register-email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-charcoal-300 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                id="register-password"
                            />
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 disabled:opacity-50"
                            id="register-submit-btn"
                        >
                            {loading ? 'Creating...' : 'Create Account'}
                        </motion.button>
                    </form>

                    <p className="text-center text-charcoal-400 text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
