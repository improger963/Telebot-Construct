
import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Logo from '../components/Logo';

// Copied from new Landing Page for consistent background
const AnimatedBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId: number;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = Array.from({ length: 50 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.1
        }));

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(16, 185, 129, ${particle.opacity})`;
                ctx.fill();
            });
            
            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-30 z-0" />;
};


const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Не удалось зарегистрироваться. Этот email уже может быть использован.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -m-8 bg-background relative overflow-hidden">
      <AnimatedBackground />
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-900/50 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl shadow-emerald-900/20 animate-scaleIn z-10">
        <div className="text-center space-y-3">
           <Link to="/" aria-label="Back to Home">
              <Logo className="h-20 w-20 mx-auto text-brand-emerald transition-transform hover:scale-110" />
            </Link>
            <h2 className="text-4xl font-bold text-center text-text-primary bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Создать аккаунт</h2>
            <p className="text-text-secondary">Начните работу с вашим новым Telegram-ботом</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">Электронная почта</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-text-primary bg-input rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-brand-emerald transition-all"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-text-primary bg-input rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-brand-emerald transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 font-semibold text-white bg-gradient-to-r from-brand-emerald to-brand-teal rounded-xl hover:shadow-lg hover:shadow-brand-emerald/25 transition-all duration-300 hover:scale-105 active:scale-[0.98]"
          >
            Зарегистрироваться
          </button>
        </form>
        <p className="text-center text-text-secondary">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-medium text-brand-emerald hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;