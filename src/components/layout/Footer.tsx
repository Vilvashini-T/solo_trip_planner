export function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-heading font-bold text-slate-900">
                            Solotrip<span className="text-primary-600">.AI</span>
                        </h3>
                        <p className="text-sm text-slate-500 mt-2">
                            Your smart travel companion for solo adventures.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">Twitter</a>
                        <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">Instagram</a>
                        <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">LinkedIn</a>
                    </div>
                </div>
                <div className="border-t border-slate-200 mt-8 pt-8 text-center text-sm text-slate-400">
                    © {new Date().getFullYear()} Solotrip AI. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
