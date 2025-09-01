import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Users, Gavel } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Auction {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  currentBid: number;
  startingBid: number;
  endTime: Date;
  bidCount: number;
  status: 'active' | 'ended' | 'upcoming';
  category: string;
  seller: {
    name: string;
    avatar: string;
    rating: number;
  };
  bidHistory: {
    id: string;
    username: string;
    amount: number;
    timestamp: Date;
    hash: string;
  }[];
}

interface AuctionCardProps {
  auction: Auction;
  onBid?: (auctionId: string, amount: number) => void;
  onClick?: (auction: Auction) => void;
}

export const AuctionCard = ({ auction, onBid, onClick }: AuctionCardProps) => {
  const [bidAmount, setBidAmount] = useState(auction.currentBid + 10);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const { toast } = useToast();

  const timeLeft = auction.endTime.getTime() - new Date().getTime();
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const handlePlaceBid = async () => {
    if (bidAmount <= auction.currentBid) {
      toast({
        title: "Invalid bid",
        description: "Your bid must be higher than the current bid.",
        variant: "destructive",
      });
      return;
    }

    setIsPlacingBid(true);
    
    // Mock bid placement - replace with actual API call
    setTimeout(() => {
      onBid?.(auction.id, bidAmount);
      toast({
        title: "Bid placed successfully",
        description: `Your bid of $${bidAmount.toLocaleString()} has been recorded on the blockchain.`,
      });
      setIsPlacingBid(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'ended': return 'bg-muted text-muted-foreground';
      case 'upcoming': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card 
      className="bg-gradient-card border-border shadow-card hover:shadow-elegant transition-all duration-300 group cursor-pointer"
      onClick={() => onClick?.(auction)}
    >
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={auction.image} 
            alt={auction.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Badge className={getStatusColor(auction.status)}>
              {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-background/80 text-foreground">
              {auction.category}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-foreground">{auction.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{auction.description}</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Current Bid</span>
            </div>
            <span className="text-2xl font-bold text-primary">
              ${auction.currentBid.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{auction.bidCount} bids</span>
            </div>
            {auction.status === 'active' && timeLeft > 0 && (
              <div className="flex items-center space-x-2 text-accent">
                <Clock className="h-4 w-4" />
                <span>
                  {days > 0 ? `${days}d ` : ''}
                  {hours > 0 ? `${hours}h ` : ''}
                  {minutes}m left
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {auction.status === 'active' && timeLeft > 0 && (
        <CardFooter className="p-6 pt-0">
          <div className="w-full space-y-3">
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  min={auction.currentBid + 1}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter bid amount"
                />
              </div>
              <Button 
                onClick={handlePlaceBid}
                disabled={isPlacingBid}
                className="bg-gradient-primary hover:opacity-90 transition-smooth"
              >
                <Gavel className="h-4 w-4 mr-2" />
                {isPlacingBid ? 'Bidding...' : 'Bid'}
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};