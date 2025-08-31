import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, DollarSign, User, Hash, Calendar, Gavel, ChevronLeft, ChevronRight, X } from 'lucide-react';
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

interface AuctionModalProps {
  auction: Auction | null;
  isOpen: boolean;
  onClose: () => void;
  onBid?: (auctionId: string, amount: number) => void;
}

export const AuctionModal = ({ auction, isOpen, onClose, onBid }: AuctionModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const { toast } = useToast();

  if (!auction) return null;

  const images = auction.images || [auction.image];
  const timeLeft = auction.endTime.getTime() - new Date().getTime();
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
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
      toast({
        title: "Bid placed successfully",
        description: `Your bid of $${bidAmount.toLocaleString()} has been recorded on the blockchain.`,
      });
      setIsPlacingBid(false);
      setBidAmount(auction.currentBid + 50);
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
          <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
          <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-gradient-card border-border">
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
                <div className="relative bg-secondary/20">
                  <div className="relative h-full">
                    <img
                      src={images[currentImageIndex]}
                      alt={auction.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {images.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex ? 'bg-primary' : 'bg-white/50'
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            />
                          ))}
                        </div>
                      </>
                    )}
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
                    <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
                      <img
                        src={auction.seller.avatar}
                        alt={auction.seller.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-foreground">{auction.seller.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ⭐ {auction.seller.rating}/5 rating
                        </div>
                      </div>
                    </div>

                    {/* Current Bid and Timer */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary/20 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm">Current Bid</span>
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          ${auction.currentBid.toLocaleString()}
                        </div>
                      </div>
                      
                      {auction.status === 'active' && timeLeft > 0 && (
                        <div className="p-4 bg-secondary/20 rounded-lg">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Time Left</span>
                          </div>
                          <div className="text-lg font-bold text-accent">
                            {days > 0 ? `${days}d ` : ''}
                            {hours > 0 ? `${hours}h ` : ''}
                            {minutes}m
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
                        {auction.bidHistory.map((bid) => (
                          <motion.div
                            key={bid.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-3 bg-secondary/10 rounded border-l-2 border-primary/30"
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
                              <div className="text-xs text-muted-foreground font-mono">
                                {bid.hash.slice(0, 8)}...{bid.hash.slice(-6)}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bid Section */}
                  {auction.status === 'active' && timeLeft > 0 && (
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
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};