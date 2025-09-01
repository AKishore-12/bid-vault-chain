import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, DollarSign, User, Hash, Copy, Gavel, ChevronLeft, ChevronRight, X, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCountdown } from '@/hooks/useCountdown';
import { SellerProfileCard } from '@/components/SellerProfileCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    trustLevel: string;
    itemsListed: number;
    joinedDate: string;
    completedSales: number;
  };
  bidHistory: {
    id: string;
    username: string;
    amount: number;
    timestamp: Date;
    hash: string;
  }[];
}

interface AuctionModalProps {
  auction: Auction | null;
  isOpen: boolean;
  onClose: () => void;
  onBid?: (auctionId: string, amount: number) => void;
}

export const AuctionModal = ({ auction, isOpen, onClose, onBid }: AuctionModalProps) => {
  const [bidAmount, setBidAmount] = useState(0);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [showSellerProfile, setShowSellerProfile] = useState(false);
  const [sellerProfilePosition, setSellerProfilePosition] = useState({ x: 0, y: 0 });
  const [currentBidDisplay, setCurrentBidDisplay] = useState(0);
  const { toast } = useToast();

  if (!auction) return null;

  const images = auction.images || [auction.image];
  const countdown = useCountdown(auction.endTime);

  // Animate bid updates
  useEffect(() => {
    setCurrentBidDisplay(auction.currentBid);
  }, [auction.currentBid]);

  const handleSellerClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSellerProfilePosition({
      x: rect.right + 10,
      y: rect.top,
    });
    setShowSellerProfile(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Transaction hash copied successfully.",
    });
  };

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
    
    setTimeout(() => {
      onBid?.(auction.id, bidAmount);
      
      // Animate bid increase
      const startBid = currentBidDisplay;
      const targetBid = bidAmount;
      const duration = 800;
      const startTime = Date.now();
      
      const animateBid = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const currentValue = startBid + (targetBid - startBid) * eased;
        
        setCurrentBidDisplay(Math.round(currentValue));
        
        if (progress < 1) {
          requestAnimationFrame(animateBid);
        }
      };
      
      requestAnimationFrame(animateBid);
      
      toast({
        title: "Bid placed successfully",
        description: `Your bid of $${bidAmount.toLocaleString()} has been recorded on the blockchain.`,
      });
      setIsPlacingBid(false);
      setBidAmount(bidAmount + 50);
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
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-7xl w-full h-[95vh] p-0 bg-gradient-card border-border overflow-hidden">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(auction.status)}>
                    {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                  </Badge>
                  <Badge variant="secondary">{auction.category}</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Main Content */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
                {/* Left Side - Image Carousel */}
                <div className="relative bg-black">
                  <div className="h-[400px] lg:h-full flex items-center justify-center">
                    <Carousel className="w-full max-w-full">
                      <CarouselContent>
                        {images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="relative h-[400px] lg:h-[600px] flex items-center justify-center bg-black">
                              <img
                                src={image}
                                alt={`${auction.title} - Image ${index + 1}`}
                                className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105 cursor-zoom-in"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {images.length > 1 && (
                        <>
                          <CarouselPrevious className="left-4 bg-background/80 hover:bg-background/90 border-border" />
                          <CarouselNext className="right-4 bg-background/80 hover:bg-background/90 border-border" />
                        </>
                      )}
                    </Carousel>
                  </div>
                </div>

                {/* Right Side - Details */}
                <div className="flex flex-col overflow-y-auto">
                  <div className="p-6 space-y-6">
                    {/* Title and Description */}
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-3">{auction.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{auction.description}</p>
                    </div>

                    {/* Seller Info */}
                    <button 
                      onClick={handleSellerClick}
                      className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors w-full text-left"
                    >
                      <img
                        src={auction.seller.avatar}
                        alt={auction.seller.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{auction.seller.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ⭐ {auction.seller.rating}/5 rating • {auction.seller.trustLevel}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Click for profile
                      </div>
                    </button>

                    {/* Current Bid and Timer */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary/20 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm">Current Bid</span>
                        </div>
                        <motion.div 
                          key={currentBidDisplay}
                          initial={{ scale: 1.2, opacity: 0.8 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="text-2xl font-bold text-primary"
                        >
                          ${currentBidDisplay.toLocaleString()}
                        </motion.div>
                      </div>
                      
                      {auction.status === 'active' && !countdown.isExpired && (
                        <div className="p-4 bg-secondary/20 rounded-lg">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Time Left</span>
                            {countdown.isLowTime && (
                              <Zap className="h-4 w-4 text-destructive animate-pulse" />
                            )}
                          </div>
                          <div className={`text-lg font-bold font-mono ${
                            countdown.isLowTime ? 'text-destructive animate-pulse' : 'text-accent'
                          }`}>
                            {countdown.formattedTime}
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Blockchain Transparency - Bid History */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Hash className="h-5 w-5" />
                        Blockchain Transaction History
                      </h3>
                      <div className="space-y-3 max-h-40 overflow-y-auto">
                        <TooltipProvider>
                          {auction.bidHistory.map((bid) => (
                            <motion.div
                              key={bid.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center justify-between p-3 bg-secondary/10 rounded border-l-2 border-primary/30 hover:bg-secondary/20 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="font-medium text-foreground">{bid.username}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {bid.timestamp.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-primary">${bid.amount.toLocaleString()}</div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => copyToClipboard(bid.hash)}
                                      className="flex items-center gap-1 text-xs text-muted-foreground font-mono hover:text-foreground transition-colors"
                                    >
                                      <span>{bid.hash.slice(0, 8)}...{bid.hash.slice(-6)}</span>
                                      <Copy className="h-3 w-3" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs text-xs">
                                      Blockchain verified transaction. Click to copy full hash: {bid.hash}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </motion.div>
                          ))}
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>

                  {/* Bid Section */}
                  {auction.status === 'active' && !countdown.isExpired && (
                    <div className="p-6 border-t border-border bg-secondary/10">
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <input
                            type="number"
                            value={bidAmount || ''}
                            onChange={(e) => setBidAmount(Number(e.target.value))}
                            min={auction.currentBid + 1}
                            placeholder={`Min bid: $${(auction.currentBid + 1).toLocaleString()}`}
                            className="flex-1 px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <Button
                            onClick={handlePlaceBid}
                            disabled={isPlacingBid || bidAmount <= auction.currentBid}
                            className="px-8 bg-gradient-primary hover:opacity-90 transition-smooth"
                          >
                            <Gavel className="h-4 w-4 mr-2" />
                            {isPlacingBid ? 'Placing...' : 'Place Bid'}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          All bids are secured and recorded on the blockchain for complete transparency.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            
            <SellerProfileCard
              seller={{
                ...auction.seller,
                itemsListed: auction.seller.itemsListed || 12,
                joinedDate: auction.seller.joinedDate || '2023',
                completedSales: auction.seller.completedSales || 47,
              }}
              isOpen={showSellerProfile}
              onClose={() => setShowSellerProfile(false)}
              position={sellerProfilePosition}
            />
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};