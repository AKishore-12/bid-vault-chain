import { useState, useEffect } from 'react';
import { AuctionCard } from '@/components/AuctionCard';
import { AuctionModal } from '@/components/AuctionModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

// Mock auction data - replace with actual API calls
import rolexImage from '@/assets/rolex-submariner.jpg';
import vanGoghImage from '@/assets/van-gogh-sketch.jpg';
import ferrariImage from '@/assets/ferrari-model.jpg';
import rugImage from '@/assets/persian-rug.jpg';

const mockAuctions = [
  {
    id: '1',
    title: 'Vintage Rolex Submariner',
    description: 'Rare 1970s Rolex Submariner in excellent condition. Original box and papers included. A true collector\'s piece with documented provenance and service history.',
    image: rolexImage,
    images: [rolexImage],
    currentBid: 15500,
    startingBid: 8000,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    bidCount: 23,
    status: 'active' as const,
    category: 'Watches',
    seller: {
      name: 'WatchCollector_Pro',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 4.9
    },
    bidHistory: [
      {
        id: '1',
        username: 'TimepieceEnthusiast',
        amount: 15500,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        hash: '0xa1b2c3d4e5f6789012345678901234567890abcdef123456789'
      },
      {
        id: '2',
        username: 'VintageWatchFan',
        amount: 14800,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        hash: '0xf6e5d4c3b2a1098765432109876543210987654321abcdef012'
      }
    ]
  },
  {
    id: '2',
    title: 'Original Van Gogh Sketch',
    description: 'Authenticated original sketch by Vincent van Gogh, dated 1888. Provenance documented with museum-quality certification and historical records.',
    image: vanGoghImage,
    images: [vanGoghImage],
    currentBid: 125000,
    startingBid: 75000,
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    bidCount: 47,
    status: 'active' as const,
    category: 'Art',
    seller: {
      name: 'ArtGallery_Elite',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.8
    },
    bidHistory: [
      {
        id: '3',
        username: 'ArtCollector_1890',
        amount: 125000,
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        hash: '0x1234567890abcdef1234567890abcdef12345678901234567890'
      }
    ]
  },
  {
    id: '3',
    title: 'Ferrari 250 GT Model',
    description: 'Limited edition 1:18 scale Ferrari 250 GT model by CMC. Only 500 pieces made worldwide. Certificate of authenticity included.',
    image: ferrariImage,
    images: [ferrariImage],
    currentBid: 850,
    startingBid: 400,
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    bidCount: 12,
    status: 'active' as const,
    category: 'Collectibles',
    seller: {
      name: 'ModelCars_Expert',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      rating: 4.7
    },
    bidHistory: [
      {
        id: '4',
        username: 'FerrariEnthusiast',
        amount: 850,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        hash: '0xabcdef1234567890abcdef1234567890abcdef12345678901234'
      }
    ]
  },
  {
    id: '4',
    title: 'Antique Persian Rug',
    description: '19th century hand-woven Persian rug from Isfahan region. Exceptional craftsmanship and condition. Professionally cleaned and appraised.',
    image: rugImage,
    images: [rugImage],
    currentBid: 3200,
    startingBid: 1500,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    bidCount: 18,
    status: 'active' as const,
    category: 'Antiques',
    seller: {
      name: 'AntiqueDealer_1925',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c38e?w=150&h=150&fit=crop&crop=face',
      rating: 4.9
    },
    bidHistory: [
      {
        id: '5',
        username: 'RugCollector',
        amount: 3200,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        hash: '0x567890abcdef1234567890abcdef1234567890abcdef123456'
      }
    ]
  }
];

const Dashboard = () => {
  const [auctions, setAuctions] = useState(mockAuctions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<typeof mockAuctions[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['all', 'Art', 'Watches', 'Collectibles', 'Antiques', 'Jewelry'];

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || auction.category === selectedCategory;
    const matchesPrice = auction.currentBid >= priceRange[0] && auction.currentBid <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    switch (sortBy) {
      case 'ending-soon':
        return a.endTime.getTime() - b.endTime.getTime();
      case 'highest-bid':
        return b.currentBid - a.currentBid;
      case 'most-bids':
        return b.bidCount - a.bidCount;
      default:
        return 0;
    }
  });

  const handleBid = (auctionId: string, amount: number) => {
    const newBid = {
      id: Date.now().toString(),
      username: 'You',
      amount,
      timestamp: new Date(),
      hash: `0x${Math.random().toString(16).substr(2, 42)}`
    };

    setAuctions(prev => prev.map(auction => 
      auction.id === auctionId 
        ? { 
            ...auction, 
            currentBid: amount, 
            bidCount: auction.bidCount + 1,
            bidHistory: [newBid, ...auction.bidHistory]
          }
        : auction
    ));

    // Update selected auction if it's the same one
    if (selectedAuction?.id === auctionId) {
      setSelectedAuction(prev => prev ? {
        ...prev,
        currentBid: amount,
        bidCount: prev.bidCount + 1,
        bidHistory: [newBid, ...prev.bidHistory]
      } : null);
    }
  };

  const handleAuctionClick = (auction: typeof mockAuctions[0]) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Live Blockchain Auctions
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Secure, transparent bidding powered by blockchain technology
        </p>
      </div>


      {/* Enhanced Filters */}
      <div className="bg-gradient-card border border-border rounded-lg p-6">
        <div className="flex flex-col gap-4">
          {/* Search and Toggle */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search auctions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-secondary border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="ending-soon">Ending Soon</option>
                <option value="highest-bid">Highest Bid</option>
                <option value="most-bids">Most Bids</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={200000}
                  min={0}
                  step={1000}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auctions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedAuctions.map(auction => (
          <AuctionCard
            key={auction.id}
            auction={auction}
            onBid={handleBid}
            onClick={handleAuctionClick}
          />
        ))}
      </div>

      {/* Auction Modal */}
      <AuctionModal
        auction={selectedAuction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBid={handleBid}
      />

      {sortedAuctions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">No auctions found matching your criteria</div>
          <Button className="mt-4" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;