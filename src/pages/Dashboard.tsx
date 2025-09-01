import { useState, useEffect } from 'react';
import { AuctionCard } from '@/components/AuctionCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

// Mock auction data - replace with actual API calls
import rolexImage from '@/assets/rolex-submariner.jpg';
import vanGoghImage from '@/assets/van-gogh-sketch.jpg';
import ferrariImage from '@/assets/ferrari-model.jpg';
import rugImage from '@/assets/persian-rug.jpg';

const mockAuctions = [
  {
    id: '1',
    title: 'Vintage Rolex Submariner',
    description: 'Rare 1970s Rolex Submariner in excellent condition. Original box and papers included. A true collector\'s piece.',
    image: rolexImage,
    currentBid: 15500,
    startingBid: 8000,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    bidCount: 23,
    status: 'active' as const,
    category: 'Watches'
  },
  {
    id: '2',
    title: 'Original Van Gogh Sketch',
    description: 'Authenticated original sketch by Vincent van Gogh, dated 1888. Provenance documented.',
    image: vanGoghImage,
    currentBid: 125000,
    startingBid: 75000,
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    bidCount: 47,
    status: 'active' as const,
    category: 'Art'
  },
  {
    id: '3',
    title: 'Ferrari 250 GT Model',
    description: 'Limited edition 1:18 scale Ferrari 250 GT model by CMC. Only 500 pieces made worldwide.',
    image: ferrariImage,
    currentBid: 850,
    startingBid: 400,
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    bidCount: 12,
    status: 'active' as const,
    category: 'Collectibles'
  },
  {
    id: '4',
    title: 'Antique Persian Rug',
    description: '19th century hand-woven Persian rug from Isfahan region. Exceptional craftsmanship and condition.',
    image: rugImage,
    currentBid: 3200,
    startingBid: 1500,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    bidCount: 18,
    status: 'active' as const,
    category: 'Antiques'
  }
];

const Dashboard = () => {
  const [auctions, setAuctions] = useState(mockAuctions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('ending-soon');

  const categories = ['all', 'Art', 'Watches', 'Collectibles', 'Antiques', 'Jewelry'];

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || auction.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
    setAuctions(prev => prev.map(auction => 
      auction.id === auctionId 
        ? { ...auction, currentBid: amount, bidCount: auction.bidCount + 1 }
        : auction
    ));
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


      {/* Filters */}
      <div className="bg-gradient-card border border-border rounded-lg p-6">
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
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-secondary border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
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
      </div>

      {/* Auctions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedAuctions.map(auction => (
          <AuctionCard
            key={auction.id}
            auction={auction}
            onBid={handleBid}
          />
        ))}
      </div>

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