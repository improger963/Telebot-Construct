import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Icons for "How it works"
const DescribeIcon: React.FC<{className?: string}> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const CustomizeIcon: React.FC<{className?: string}> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.11a7.5 7.5 0 015.586 5.586c-.103.55-.568 1.02-1.11 1.11m-5.586 0a7.5 7.5 0 005.586 5.586c.103.55.568 1.02 1.11 1.11m-5.586 0a7.5 7.5 0 01-5.586-5.586c-.103-.55-.568-1.02-1.11-1.11m5.586 0A7.5 7.5 0 003.94 9.594c-.542-.09-1.007-.56-1.11-1.11m5.586 0A7.5 7.5 0 019.594 3.94c.542.09 1.007.56 1.11 1.11M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const LaunchIcon: React.FC<{className?: string}> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

// Icons for features
const VisualBuilderIcon: React.FC<{className?: string}> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-4 text-emerald-400" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
  </svg>
);

const AIPoweredIcon: React.FC<{className?: string}> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-4 text-violet-400" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const RealtimeSimulatorIcon: React.FC<{className?: string}> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-4 text-amber-400" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 2.25-4.5 2.25V9.75Z" />
  </svg>
);

const CompanyLogo: React.FC<{ name: string, className?: string }> = ({ name, className }) => (
  <div className={`${className} font-bold text-lg tracking-wider opacity-60 hover:opacity-100 transition-all duration-300 cursor-default`}>
    {name}
  </div>
);

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className}>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="24" height="24" rx="6" fill="url(#logoGradient)" />
    <path d="M12 10v12l8-6z" fill="white" />
  </svg>
);

const FeatureCard: React.FC<{ children: React.ReactNode, delay: number, className?: string }> = ({ children, delay, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, [delay]);

    return (
        <div
            ref={cardRef}
            className={`
                group relative overflow-hidden
                bg-gradient-to-br from-slate-900/50 to-slate-800/30
                backdrop-blur-xl border border-slate-700/50
                rounded-3xl p-8 h-full
                hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10
                transition-all duration-500 ease-out
                hover:-translate-y-2 hover:scale-[1.02]
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                ${className}
            `}
            style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)',
            }}
        >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-violet-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            <div className="relative z-10">
                {children}
            </div>
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
        </div>
    );
};

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

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-30" />;
};

const LandingPage: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                setMousePosition({
                    x: (e.clientX - rect.left) / rect.width,
                    y: (e.clientY - rect.top) / rect.height
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="bg-slate-950 text-white min-h-screen overflow-x-hidden -m-8">
            <AnimatedBackground />
            
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/50">
                <nav className="container mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold flex items-center gap-3 group cursor-pointer">
                        <Logo className="h-10 w-10 group-hover:scale-110 transition-transform duration-300" />
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            TeleBot Constructor
                        </span>
                    </Link>
                    <div className="flex items-center space-x-3">
                        <Link to="/login" className="px-6 py-2.5 font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-300 hover:scale-105">
                            Войти
                        </Link>
                        <Link to="/register" className="px-6 py-2.5 font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 active:scale-95">
                            Регистрация
                        </Link>
                    </div>
                </nav>
            </header>

            <main>
                <section 
                    ref={heroRef}
                    className="relative pt-32 pb-20 text-center overflow-hidden min-h-screen flex items-center"
                    style={{
                        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)`
                    }}
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="container relative z-10 mx-auto px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
                                <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent animate-pulse">
                                    Создавайте мощных
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                                    Telegram-ботов
                                </span>
                                <br />
                                <span className="text-slate-300 text-4xl md:text-6xl font-light">
                                    Визуально.
                                </span>
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed">
                                Стройте, тестируйте и запускайте сложные диалоговые сценарии с помощью нашего интуитивного drag-and-drop редактора.
                                <br />
                                <span className="text-emerald-400 font-semibold">На базе ИИ</span>, создано для креаторов. Код не требуется.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                                <Link to="/register" className="group relative px-12 py-4 font-bold text-lg text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden">
                                    <span className="relative z-10">Начать бесплатно</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                                <a href="#showcase" className="px-12 py-4 font-bold text-lg text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-emerald-500/50 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-95 hover:text-white">
                                    Посмотреть в действии
                                </a>
                            </div>
                            
                            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                    <span>Код не требуется</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                    <span>Бесплатный старт</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                                    <span>С поддержкой ИИ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="py-16 relative overflow-hidden bg-slate-900/50">
                    <div className="text-center mb-8">
                        <p className="text-slate-400 text-sm uppercase tracking-wider">Нам доверяют инновационные команды</p>
                    </div>
                    <div className="flex whitespace-nowrap">
                        <div className="flex space-x-16 items-center animate-marquee">
                            {['NEXUS', 'APEX DIGITAL', 'QUANTUM LEAP', 'STELLAR', 'FUSION WORKS', 'ZENITH'].map((name, i) => (
                                <CompanyLogo key={i} name={name} className="text-2xl" />
                            ))}
                        </div>
                        <div className="flex space-x-16 items-center animate-marquee" aria-hidden="true">
                             {['NEXUS', 'APEX DIGITAL', 'QUANTUM LEAP', 'STELLAR', 'FUSION WORKS', 'ZENITH'].map((name, i) => (
                                <CompanyLogo key={i} name={name} className="text-2xl" />
                            ))}
                        </div>
                    </div>
                </div>

                <section id="showcase" className="py-24 bg-gradient-to-b from-slate-900/50 to-slate-950">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="text-center mb-20">
                            <h2 className="text-5xl md:text-6xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                    Будущее создания ботов
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                    визуально
                                </span>
                            </h2>
                            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                                Перестаньте бороться с кодом. Начните проектировать диалоги с нашим интуитивно понятным и мощным редактором.
                            </p>
                        </div>
                        
                        <div className="relative w-full max-w-7xl mx-auto">
                            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-4 shadow-2xl shadow-emerald-500/10">
                                <div className="bg-slate-950 w-full h-96 md:h-[500px] rounded-2xl overflow-hidden border border-slate-700/50 p-6 flex gap-6">
                                    <div className="w-1/4 h-full bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-xl p-4 space-y-4 backdrop-blur-xl">
                                        <div className="h-10 w-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-500/30"></div>
                                        <div className="h-16 w-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-lg border border-violet-500/30"></div>
                                        <div className="h-16 w-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30"></div>
                                        <div className="h-16 w-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30"></div>
                                    </div>
                                    
                                    <div className="w-3/4 h-full relative">
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                            <defs>
                                                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                                                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.4" />
                                                </linearGradient>
                                            </defs>
                                            <path 
                                                d="M100 80 Q200 120 300 180" 
                                                stroke="url(#connectionGradient)" 
                                                strokeWidth="3" 
                                                fill="none"
                                                className="animate-pulse"
                                            />
                                            <path 
                                                d="M300 200 Q400 240 500 180" 
                                                stroke="url(#connectionGradient)" 
                                                strokeWidth="3" 
                                                fill="none"
                                                className="animate-pulse"
                                                style={{ animationDelay: '0.5s' }}
                                            />
                                        </svg>
                                        
                                        <div className="absolute top-[15%] left-[15%] w-44 h-20 bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 border-2 border-emerald-400/50 rounded-xl p-3 backdrop-blur-xl shadow-lg shadow-emerald-500/20">
                                            <div className="text-white font-semibold text-sm">🚀 Старт</div>
                                            <div className="text-emerald-200 text-xs">Точка входа</div>
                                        </div>
                                        
                                        <div className="absolute top-[45%] left-[5%] w-52 h-24 bg-gradient-to-br from-violet-500/30 to-violet-600/20 border-2 border-violet-400/50 rounded-xl p-3 backdrop-blur-xl shadow-lg shadow-violet-500/20">
                                            <div className="text-white font-semibold text-sm">💬 Отправить сообщение</div>
                                            <div className="text-violet-200 text-xs">"Добро пожаловать в наш бот!"</div>
                                        </div>
                                        
                                        <div className="absolute top-[45%] right-[5%] w-52 h-24 bg-gradient-to-br from-amber-500/30 to-amber-600/20 border-2 border-amber-400/50 rounded-xl p-3 backdrop-blur-xl shadow-lg shadow-amber-500/20">
                                            <div className="text-white font-semibold text-sm">❓ Запросить ввод</div>
                                            <div className="text-amber-200 text-xs">Получить ответ пользователя</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-slate-950">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="text-center mb-20">
                            <h2 className="text-5xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                    От идеи до рабочего бота
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                    за минуты
                                </span>
                            </h2>
                            <p className="text-xl text-slate-400">Простой процесс создания, разработанный для скорости.</p>
                        </div>
                        
                        <div className="relative max-w-4xl mx-auto">
                            <div className="absolute left-16 top-0 h-full w-1 bg-gradient-to-b from-emerald-500 via-violet-500 to-amber-500 opacity-50"></div>
                            
                            <div className="relative space-y-24">
                                {[
                                    { icon: DescribeIcon, color: 'emerald', title: '1. Опишите или выберите', desc: 'Начните, описав логику вашего бота на простом языке с помощью нашего AI-генератора. Или выберите готовый шаблон, чтобы начать мгновенно.' },
                                    { icon: CustomizeIcon, color: 'violet', title: '2. Настройте и соберите', desc: 'Отладьте сценарий с помощью нашего мощного визуального редактора. Перетаскивайте новые блоки, соединяйте их и настраивайте с помощью AI-подсказок.' },
                                    { icon: LaunchIcon, color: 'amber', title: '3. Тестируйте и запускайте', desc: 'Протестируйте всего бота во встроенном симуляторе. Когда все будет готово, подключите его к Telegram в один клик и запускайте!' }
                                ].map((step, i) => (
                                    <div key={i} className="relative flex items-start">
                                        <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br from-${step.color}-500/20 to-${step.color}-600/10 flex-shrink-0 flex items-center justify-center border-4 border-${step.color}-500/30 relative z-10 backdrop-blur-xl shadow-lg shadow-${step.color}-500/20`}>
                                            <step.icon className={`w-12 h-12 text-${step.color}-400`} />
                                        </div>
                                        <div className="ml-12 pt-8">
                                            <h3 className="text-3xl font-bold mb-4 text-white">{step.title}</h3>
                                            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="text-center mb-20">
                            <h2 className="text-5xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                    Лучший набор
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                    инструментов No-Code
                                </span>
                            </h2>
                            <p className="text-xl text-slate-400">Все лучшие функции на одной удобной платформе.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard delay={200}>
                                <VisualBuilderIcon />
                                <h3 className="text-2xl font-bold mb-4 text-white">Визуальный конструктор</h3>
                                <p className="text-slate-400 leading-relaxed">Проектируйте сложную логику бота с помощью простого drag-and-drop интерфейса. Соединяйте блоки, чтобы создать свой сценарий.</p>
                            </FeatureCard>
                            
                            <FeatureCard delay={400}>
                                <AIPoweredIcon />
                                <h3 className="text-2xl font-bold mb-4 text-white">Создание с помощью ИИ</h3>
                                <p className="text-slate-400 leading-relaxed">Опишите своего бота на простом языке, и наш ИИ сгенерирует для вас весь сценарий за считанные секунды.</p>
                            </FeatureCard>
                            
                            <FeatureCard delay={600}>
                                <RealtimeSimulatorIcon />
                                <h3 className="text-2xl font-bold mb-4 text-white">Симулятор в реальном времени</h3>
                                <p className="text-slate-400 leading-relaxed">Мгновенно тестируйте своего бота прямо в редакторе, чтобы убедиться, что он работает идеально, прежде чем запускать.</p>
                            </FeatureCard>
                        </div>
                    </div>
                </section>

                <section className="py-32 text-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-violet-500/15 to-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-amber-500/15 to-orange-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="container relative z-10 mx-auto px-6 lg:px-8">
                        <h2 className="text-6xl md:text-7xl font-black mb-6">
                            <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                                Готовы создать
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                своего бота?
                            </span>
                        </h2>
                        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Присоединяйтесь к тысячам создателей и начните создавать потрясающих Telegram-ботов за минуты, а не часы.
                        </p>
                        <Link to="/register" className="group relative px-16 py-5 font-bold text-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden">
                            <span className="relative z-10">Зарегистрироваться бесплатно</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-full group-hover:translate-x-0"></div>
                        </Link>
                        
                        <div className="mt-8 text-sm text-slate-500">
                            Начните создавать сегодня • Кредитная карта не требуется
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-12 bg-slate-950 border-t border-slate-800/50">
                <div className="container mx-auto px-6 lg:px-8 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Logo className="h-6 w-6" />
                        <span className="font-semibold">TeleBot Constructor</span>
                    </div>
                    <p>&copy; {new Date().getFullYear()} TeleBot Constructor. Все права защищены.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;