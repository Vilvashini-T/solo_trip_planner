import { useState } from 'react';
import { Card, CardContent } from '@/components/core/Card';
import { Button } from '@/components/core/Button';
import { Heart, MessageCircle, Share2, MapPin, User } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Community Data
const COMMUNITY_TRIPS = [
    {
        id: 'c1',
        user: {
            name: 'Sarah Jenkins',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
            handle: '@sarahj_travels'
        },
        destination: 'Kyoto, Japan',
        days: 5,
        cost: '¥150,000',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800',
        description: 'Spent 5 amazing days exploring the ancient temples and bamboo forests. The matcha ice cream is a must-try!',
        likes: 124,
        comments: 18,
        tags: ['Culture', 'Food', 'Nature'],
        postedAt: '2 hours ago'
    },
    {
        id: 'c2',
        user: {
            name: 'David Chen',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
            handle: '@david_explorer'
        },
        destination: 'Reykjavik, Iceland',
        days: 7,
        cost: 'kr 250,000',
        image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=800',
        description: 'Chasing the northern lights was a dream come true. The Blue Lagoon is totally worth the hype.',
        likes: 89,
        comments: 12,
        tags: ['Adventure', 'Photography', 'Cold'],
        postedAt: '5 hours ago'
    },
    {
        id: 'c3',
        user: {
            name: 'Elena Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150',
            handle: '@elena_roams'
        },
        destination: 'Rome, Italy',
        days: 4,
        cost: '€1,200',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800',
        description: 'Eat, Pray, Love style weekend in Rome. The pasta just hits different here.',
        likes: 256,
        comments: 45,
        tags: ['Food', 'History', 'City'],
        postedAt: '1 day ago'
    }
];

export function Community() {
    const [likedPosts, setLikedPosts] = useState<string[]>([]);

    const toggleLike = (id: string) => {
        if (likedPosts.includes(id)) {
            setLikedPosts(likedPosts.filter(p => p !== id));
        } else {
            setLikedPosts([...likedPosts, id]);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 pb-32 max-w-3xl min-h-screen">
            <div className="text-center space-y-4 mb-12 animate-fade-in pt-10">
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-slate-900">
                    Travel Community
                </h1>
                <p className="text-lg text-slate-600">
                    See where others are going and get inspired.
                </p>
            </div>

            <div className="space-y-8 animate-slide-up">
                {COMMUNITY_TRIPS.map((post) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="overflow-hidden border-slate-100 hover:shadow-lg transition-all rounded-3xl">
                            <div className="p-4 flex items-center gap-3 border-b border-slate-50">
                                <img
                                    src={post.user.avatar}
                                    alt={post.user.name}
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100"
                                />
                                <div>
                                    <h4 className="font-bold text-slate-900 leading-tight">{post.user.name}</h4>
                                    <p className="text-xs text-slate-500">{post.user.handle} • {post.postedAt}</p>
                                </div>
                            </div>

                            <div className="relative h-64 md:h-80 bg-slate-100">
                                <img
                                    src={post.image}
                                    alt={post.destination}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-4 left-4 inline-block px-3 py-1 bg-black/60 backdrop-blur-md text-white rounded-full text-sm font-medium">
                                    <MapPin className="inline-block w-3 h-3 mr-1" />
                                    {post.destination}
                                </div>
                            </div>

                            <CardContent className="p-5">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-lg font-medium border border-slate-100">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-slate-700 mb-4 leading-relaxed">
                                    {post.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex gap-4">
                                        <button
                                            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${likedPosts.includes(post.id) ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
                                            onClick={() => toggleLike(post.id)}
                                        >
                                            <Heart className={`w-5 h-5 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                                            {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                                        </button>
                                        <button className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors">
                                            <MessageCircle className="w-5 h-5" />
                                            {post.comments}
                                        </button>
                                    </div>
                                    <button className="text-slate-400 hover:text-primary-600 transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <p className="text-slate-500 mb-4">Want to share your own adventure?</p>
                <Button variant="outline" className="gap-2">
                    <User className="w-4 h-4" /> Create Profile to Post
                </Button>
            </div>
        </div>
    );
}
