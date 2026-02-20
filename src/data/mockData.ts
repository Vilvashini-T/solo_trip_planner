import { Mountain, Palmtree, Camera, Landmark, Music, Utensils } from 'lucide-react';

export const DESTINATIONS = [
    {
        id: '1',
        name: 'India',
        type: 'Country',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop',
        flag: '🇮🇳',
        currency: '₹',
        description: 'Land of diverse cultures, spirituality, and spice.'
    },
    {
        id: '2',
        name: 'France',
        type: 'Country',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop',
        flag: '🇫🇷',
        currency: '€',
        description: 'Art, gastronomy, and romance.'
    },
    {
        id: '3',
        name: 'Japan',
        type: 'Country',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop',
        flag: '🇯🇵',
        currency: '¥',
        description: 'Ancient tradition meets futuristic technology.'
    },
    {
        id: '4',
        name: 'USA',
        type: 'Country',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
        flag: '🇺🇸',
        currency: '$',
        description: 'From bustling metropolises to vast national parks.'
    },
    {
        id: '5',
        name: 'Indonesia',
        type: 'Country',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop',
        flag: '🇮🇩',
        currency: 'Rp',
        description: 'Tropical paradise of islands and volcanoes.'
    },
    {
        id: '6',
        name: 'Italy',
        type: 'Country',
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1000&auto=format&fit=crop',
        flag: '🇮🇹',
        currency: '€',
        description: 'History, art, and world-class cuisine.'
    },
    {
        id: '7',
        name: 'Iceland',
        type: 'Country',
        image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1000&auto=format&fit=crop',
        flag: '🇮🇸',
        currency: 'kr',
        description: 'Land of fire and ice.'
    },
    {
        id: '8',
        name: 'Turkey',
        type: 'Country',
        image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1000&auto=format&fit=crop',
        flag: '🇹🇷',
        currency: '₺',
        description: 'Where East meets West.'
    }
];

export const INTERESTS = [
    {
        id: 'culture',
        label: 'Culture',
        icon: Landmark,
        image: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?q=80&w=1000&auto=format&fit=crop',
        color: 'from-orange-400 to-red-500' // Gradient for card
    },
    {
        id: 'food',
        label: 'Food',
        icon: Utensils,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
        color: 'from-yellow-400 to-orange-500'
    },
    {
        id: 'adventure',
        label: 'Adventure',
        icon: Mountain,
        image: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1000&auto=format&fit=crop',
        color: 'from-emerald-400 to-green-500'
    },
    {
        id: 'nature',
        label: 'Nature',
        icon: Palmtree,
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop',
        color: 'from-teal-400 to-cyan-500'
    },
    {
        id: 'photography',
        label: 'Photography',
        icon: Camera,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
        color: 'from-purple-400 to-indigo-500'
    },
    {
        id: 'nightlife',
        label: 'Nightlife',
        icon: Music,
        image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000&auto=format&fit=crop',
        color: 'from-violet-400 to-fuchsia-500'
    }
];

export const BUDGET_PRESETS = [
    {
        id: 'budget',
        label: 'Budget Explorer',
        range: 'Low Cost',
        min: 500,
        max: 1500,
        icon: '🎒'
    },
    {
        id: 'comfort',
        label: 'Comfortable',
        range: 'Medium Range',
        min: 1500,
        max: 3500,
        icon: '🧳'
    },
    {
        id: 'premium',
        label: 'Premium',
        range: 'High End',
        min: 3500,
        max: 10000,
        icon: '✨'
    }
];
