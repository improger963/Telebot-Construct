import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

// Locally defined components to avoid creating new files

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
const VisualBuilderIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-4 text-brand-purple">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
  </svg>
);

const AIPoweredIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-4 text-brand-blue">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const RealtimeSimulatorIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-4 text-brand-orange">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 2.25-4.5 2.25V9.75Z" />
  </svg>
);

// Fictional company logos for the marquee
const ApexDigitalLogo: React.FC<{className?: string}> = (props) => <svg viewBox="0 0 100 30" {...props}><text x="50" y="20" fontFamily="Arial" fontSize="16" fill="currentColor" textAnchor="middle">ApexDigital</text></svg>;
const NexusCorpLogo: React.FC<{className?: string}> = (props) => <svg viewBox="0 0 100 30" {...props}><text x="50" y="20" fontFamily="Georgia" fontSize="18" fill="currentColor" textAnchor="middle" fontWeight="bold">NEXUS</text></svg>;
const QuantumLeapLogo: React.FC<{className?: string}> = (props) => <svg viewBox="0 0 120 30" {...props}><text x="60" y="20" fontFamily="monospace" fontSize="16" fill="currentColor" textAnchor="middle">QUANTUMLEAP</text></svg>;
const StellarSolutionsLogo: React.FC<{className?: string}> = (props) => <svg viewBox="0 0 150 30" {...props}><text x="75" y="20" fontFamily="Verdana" fontSize="14" fill="currentColor" textAnchor="middle" fontStyle="italic">Stellar Solutions</text></svg>;
const FusionWorksLogo: React.FC<{className?: string}> = (props) => <svg viewBox="0 0 130 30" {...props}><text x="65" y="20" fontFamily="Arial Black" fontSize="16" fill="currentColor" textAnchor="middle">FusionWorks</text></svg>;
const ZenithIncLogo: React.FC<{className?: string}> = (props) => <svg viewBox="0 0 100 30" {...props}><text x="50" y="20" fontFamily="Impact" fontSize="20" fill="currentColor" textAnchor="middle">ZENITH</text></svg>;


// Hook for spotlight effect
const useSpotlight = (ref: React.RefObject<HTMLElement>) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            el.style.setProperty('--x', `${x}px`);
            el.style.setProperty('--y', `${y}px`);
        };
        el.addEventListener('mousemove', handleMouseMove);
        return () => el.removeEventListener('mousemove', handleMouseMove);
    }, [ref]);
};


const FeatureCard: React.FC<{children: React.ReactNode, delay: number}> = ({ children, delay }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    useSpotlight(cardRef);
    return (
        <div ref={cardRef} className="spotlight-card bg-surface p-8 rounded-2xl transition-all duration-300 animate-fadeInUp border border-transparent hover:border-brand-green/30" style={{ animationDelay: `${delay}ms` }}>
            <div className="relative z-10">{children}</div>
        </div>
    );
};


const LandingPage: React.FC = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parallax = parallaxRef.current;
    if (!parallax) return;

    const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 40;
        const y = (clientY / innerHeight - 0.5) * 40;
        parallax.style.setProperty('--x', `${-x}px`);
        parallax.style.setProperty('--y', `${-y}px`);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-background text-text-primary -m-8 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-input/50">
        <nav className="container mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-text-primary flex items-center gap-2 group">
            <Logo className="h-8 w-8 text-brand-green group-hover:scale-110 transition-transform duration-300" />
            TeleBot Constructor
          </Link>
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="bg-surface hover:bg-input text-text-primary font-medium py-2 px-4 rounded-lg transition-all duration-200 ease-in-out active:scale-95 hover:scale-105"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="py-2 px-4 font-semibold text-primary-text bg-gradient-to-r from-brand-green to-green-400 rounded-lg hover:opacity-90 transition-all duration-200 ease-in-out active:scale-95 hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 text-center overflow-hidden">
           {/* Parallax Background */}
            <div ref={parallaxRef} className="absolute inset-0 z-0 transition-transform duration-300 ease-out" style={{ transform: 'translate(var(--x, 0), var(--y, 0))' }}>
                 <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/10 to-background opacity-50"></div>
                 {/* Floating UI elements */}
                 <div className="absolute top-[20%] left-[15%] w-60 h-20 bg-surface/50 rounded-lg border border-input/50 transition-transform duration-500 ease-out" style={{ transform: 'translate(calc(var(--x, 0) * -0.5), calc(var(--y, 0) * -0.5))' }}></div>
                 <div className="absolute bottom-[25%] left-[30%] w-48 h-16 bg-surface/50 rounded-lg border border-input/50 transition-transform duration-500 ease-out" style={{ transform: 'translate(calc(var(--x, 0) * 0.3), calc(var(--y, 0) * 0.3))' }}></div>
                 <div className="absolute top-[30%] right-[18%] w-52 h-24 bg-surface/50 rounded-lg border border-input/50 transition-transform duration-500 ease-out" style={{ transform: 'translate(calc(var(--x, 0) * 0.8), calc(var(--y, 0) * 0.8))' }}></div>
                 <div className="absolute bottom-[20%] right-[25%] w-64 h-12 bg-surface/50 rounded-lg border border-input/50 transition-transform duration-500 ease-out" style={{ transform: 'translate(calc(var(--x, 0) * -0.2), calc(var(--y, 0) * -0.2))' }}></div>
            </div>
          <div className="container relative z-10 mx-auto px-6 lg:px-8">
            <div className="animate-fadeInUp">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
                Create Powerful Telegram Bots. Visually.
              </h1>
              <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-10">
                Build, test, and deploy complex chat flows with our intuitive drag-and-drop editor.
                Powered by AI, designed for creators. No code required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-block py-4 px-8 font-bold text-lg text-white bg-gradient-to-r from-brand-green to-green-400 rounded-lg hover:opacity-90 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg shadow-brand-green/30 hover:shadow-glow-green"
                >
                  Get Started for Free
                </Link>
                <a href="#showcase" className="inline-block py-4 px-8 font-bold text-lg text-text-primary bg-surface/80 border border-input rounded-lg hover:bg-input transition-all duration-200 ease-in-out hover:scale-105 active:scale-95">
                  See it in Action
                </a>
              </div>
              <div className="mt-8 flex justify-center items-center gap-4 text-sm text-text-secondary animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                <span>✓ No code required</span>
                <span>✓ Free to start</span>
                <span>✓ AI-powered</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Marquee Section */}
        <div className="py-12 relative w-full overflow-hidden bg-background">
            <div className="flex">
                <div className="flex space-x-16 flex-shrink-0 items-center animate-marquee">
                    <NexusCorpLogo className="h-8 text-text-secondary hover:text-white transition-colors" />
                    <ApexDigitalLogo className="h-8 text-text-secondary hover:text-white transition-colors" />
                    <QuantumLeapLogo className="h-8 text-text-secondary hover:text-white transition-colors" />
                    <StellarSolutionsLogo className="h-8 text-text-secondary hover:text-white transition-colors" />
                    <FusionWorksLogo className="h-8 text-text-secondary hover:text-white transition-colors" />
                    <ZenithIncLogo className="h-8 text-text-secondary hover:text-white transition-colors" />
                </div>
                {/* Duplicate for seamless loop */}
                <div className="flex space-x-16 flex-shrink-0 items-center animate-marquee" aria-hidden="true">
                    <NexusCorpLogo className="h-8 text-text-secondary hover:text-white transition-colors" />
                    <ApexDigitalLogo className="h-8 text-text-secondary hover:text-white transition-colors" />
                    <QuantumLeapLogo className="h-8 text-text-secondary hover:text-white transition-colors" />
                    <StellarSolutionsLogo className="h-8 text-text-secondary hover:text-white transition-colors" />
                    <FusionWorksLogo className="h-8 text-text-secondary hover:text-white transition-colors" />
                    <ZenithIncLogo className="h-8 text-text-secondary hover:text-white transition-colors" />
                </div>
            </div>
        </div>

        {/* Product Showcase Section */}
        <section id="showcase" className="py-24 bg-surface">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="text-center mb-16 animate-fadeInUp">
                    <h2 className="text-4xl font-bold">The Future of Bot Building is Visual</h2>
                    <p className="text-text-secondary mt-2 max-w-2xl mx-auto">Stop wrestling with code. Start designing conversations with our intuitive, powerful editor.</p>
                </div>
                {/* Laptop Mockup */}
                <div className="relative w-full max-w-5xl mx-auto aspect-video animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                    <div className="absolute inset-0 bg-input rounded-2xl p-2 sm:p-4">
                        <div className="bg-background w-full h-full rounded-lg overflow-hidden border border-input/50 p-4 flex gap-4">
                            {/* Mock Sidebar */}
                            <div className="w-1/4 h-full bg-surface/50 rounded-md p-3 space-y-3">
                                <div className="h-8 w-full bg-input rounded"></div>
                                <div className="h-12 w-full bg-input rounded"></div>
                                <div className="h-12 w-full bg-input rounded opacity-70"></div>
                                <div className="h-12 w-full bg-input rounded opacity-70"></div>
                            </div>
                             {/* Mock Canvas */}
                            <div className="w-3/4 h-full bg-transparent relative">
                                <div className="absolute top-[10%] left-[20%] w-40 h-16 bg-brand-green/20 border border-brand-green rounded-lg text-center p-2 text-sm text-white">Start</div>
                                <div className="absolute top-[45%] left-[10%] w-48 h-20 bg-brand-blue/20 border border-brand-blue rounded-lg p-2 text-sm text-white">Send Message</div>
                                <div className="absolute top-[45%] right-[10%] w-48 h-20 bg-brand-purple/20 border border-brand-purple rounded-lg p-2 text-sm text-white">Ask for Input</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="text-center mb-20 animate-fadeInUp">
                    <h2 className="text-4xl font-bold">Go From Idea to Live Bot in Minutes</h2>
                    <p className="text-text-secondary mt-2">A seamless creation process designed for speed.</p>
                </div>
                <div className="relative max-w-2xl mx-auto">
                    {/* Timeline */}
                    <div className="absolute left-12 top-0 h-full w-0.5 bg-input" aria-hidden="true"></div>
                    <div className="relative space-y-20">
                         {/* Step 1 */}
                        <div className="relative flex items-start animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                            <div className="w-24 h-24 rounded-full bg-surface flex-shrink-0 flex items-center justify-center border-4 border-input relative z-10">
                                <DescribeIcon className="w-10 h-10 text-brand-green" />
                            </div>
                            <div className="ml-8 pt-2">
                                <h3 className="text-2xl font-bold mb-2">1. Describe or Choose</h3>
                                <p className="text-text-secondary">Start by explaining your bot's logic in plain English, using our AI generator. Or, pick a pre-built template to get started instantly.</p>
                            </div>
                        </div>
                        {/* Step 2 */}
                        <div className="relative flex items-start animate-fadeInUp" style={{ animationDelay: '400ms' }}>
                             <div className="w-24 h-24 rounded-full bg-surface flex-shrink-0 flex items-center justify-center border-4 border-input relative z-10">
                                <CustomizeIcon className="w-10 h-10 text-brand-purple" />
                            </div>
                            <div className="ml-8 pt-2">
                                <h3 className="text-2xl font-bold mb-2">2. Customize & Build</h3>
                                <p className="text-text-secondary">Fine-tune the flow with our powerful visual editor. Drag and drop new blocks, connect them, and configure settings with AI-powered suggestions.</p>
                            </div>
                        </div>
                         {/* Step 3 */}
                        <div className="relative flex items-start animate-fadeInUp" style={{ animationDelay: '600ms' }}>
                             <div className="w-24 h-24 rounded-full bg-surface flex-shrink-0 flex items-center justify-center border-4 border-input relative z-10">
                                <LaunchIcon className="w-10 h-10 text-brand-orange" />
                            </div>
                            <div className="ml-8 pt-2">
                                <h3 className="text-2xl font-bold mb-2">3. Test & Launch</h3>
                                <p className="text-text-secondary">Test your bot end-to-end with the built-in simulator. Once you're happy, connect it to Telegram with one click and go live!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-surface">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-16 animate-fadeInUp">
              <h2 className="text-4xl font-bold">The Ultimate No-Code Toolkit</h2>
              <p className="text-text-secondary mt-2">All the best features in one seamless platform.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard delay={200}>
                <VisualBuilderIcon />
                <h3 className="text-xl font-bold mb-2">Visual Flow Builder</h3>
                <p className="text-text-secondary">Design complex bot logic with a simple drag-and-drop interface. Connect blocks to create your flow.</p>
              </FeatureCard>
              <FeatureCard delay={400}>
                <AIPoweredIcon />
                <h3 className="text-xl font-bold mb-2">AI-Powered Creation</h3>
                <p className="text-text-secondary">Describe your bot in plain English and let our AI generate the entire flow for you in seconds.</p>
              </FeatureCard>
              <FeatureCard delay={600}>
                <RealtimeSimulatorIcon />
                <h3 className="text-xl font-bold mb-2">Real-time Simulator</h3>
                <p className="text-text-secondary">Test your bot instantly within the editor to ensure it works perfectly before going live.</p>
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 text-center bg-background">
          <div className="container mx-auto px-6 lg:px-8 animate-fadeInUp">
            <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">Ready to Build Your Bot?</h2>
            <p className="text-text-secondary text-lg mb-10">Join today and start creating amazing Telegram bots in minutes.</p>
            <Link
              to="/register"
              className="inline-block py-4 px-10 font-bold text-lg text-white bg-gradient-to-r from-brand-green to-green-400 rounded-lg hover:opacity-90 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg shadow-brand-green/30 hover:shadow-glow-green"
            >
              Sign Up for Free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-surface border-t border-input">
        <div className="container mx-auto px-6 lg:px-8 text-center text-text-secondary">
          <p>&copy; {new Date().getFullYear()} TeleBot Constructor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;