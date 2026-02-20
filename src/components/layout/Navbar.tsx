import { useState, useEffect } from 'react';
import { Button } from '@/components/core/Button';
import { Menu, X, Globe, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-white/80 backdrop-blur-md shadow-sm py-3'
                    : 'bg-transparent py-5'
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-primary-600 p-2 rounded-xl text-white">
                        <Globe className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-heading font-bold text-slate-900">
                        Solotrip<span className="text-primary-600">.AI</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        to="/"
                        className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        to="/trips"
                        className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
                    >
                        My Trips
                    </Link>
                    <Link
                        to="/community"
                        className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
                    >
                        Community
                    </Link>
                    <Button variant="primary" size="sm" className="gap-2">
                        <User className="h-4 w-4" />
                        Sign In
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-slate-600"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4 flex flex-col gap-4 border-t border-slate-100 animate-slide-up">
                    <Link
                        to="/"
                        className="text-base font-medium text-slate-600 px-4 py-2 hover:bg-slate-50 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/trips"
                        className="text-base font-medium text-slate-600 px-4 py-2 hover:bg-slate-50 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        My Trips
                    </Link>
                    <Link
                        to="/community"
                        className="text-base font-medium text-slate-600 px-4 py-2 hover:bg-slate-50 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Community
                    </Link>
                    <Button className="w-full gap-2">
                        <User className="h-4 w-4" />
                        Sign In
                    </Button>
                </div>
            )}
        </nav>
    );
}
