import { useState, useEffect } from 'react';
import { Button } from '@/components/core/Button';
import { MessageSquare, Send, User, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Experience {
    _id: string;
    user: string;
    content: string;
    location: string;
    rating: number;
    date: string;
}

export function CommunityExperiences({ location }: { location: string }) {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchExperiences();
    }, [location]);

    const fetchExperiences = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/experiences?location=${location}`);
            const data = await res.json();
            setExperiences(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('http://localhost:4000/api/experiences/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: "SoloTraveler", // In real app, get from auth
                    content: newComment,
                    location: location,
                    rating: 5
                })
            });
            if (res.ok) {
                setNewComment("");
                fetchExperiences();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="mt-16 bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-200/60 shadow-inner">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary-600 rounded-2xl text-white shadow-lg shadow-primary-200">
                    <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-2xl font-heading font-bold text-slate-900">Community Experiences</h3>
                    <p className="text-slate-500 text-sm">Real stories from fellow travelers in {location}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Comments List */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-200">
                    <AnimatePresence mode='popLayout'>
                        {experiences.map((exp) => (
                            <motion.div
                                key={exp._id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                            <User className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <span className="font-bold text-slate-900 text-sm">{exp.user}</span>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={cn("h-3 w-3", i < exp.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200")} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed italic">"{exp.content}"</p>
                                <div className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    {new Date(exp.date).toLocaleDateString()}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Post New Comment */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg h-fit sticky top-8">
                    <h4 className="font-bold text-slate-900 mb-4">Share Your Experience</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="How was your trip? Share tips, hidden gems, or warnings..."
                            className="w-full h-32 p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm resize-none transition-all"
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="w-full gap-2 rounded-xl h-12 shadow-lg shadow-primary-200"
                        >
                            <Send className="h-4 w-4" />
                            {isSubmitting ? 'Posting...' : 'Post Experience'}
                        </Button>
                    </form>
                    <p className="mt-4 text-[11px] text-slate-400 text-center">
                        Your insights help fellow solo travelers stay safe and inspired.
                    </p>
                </div>
            </div>
        </section>
    );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
