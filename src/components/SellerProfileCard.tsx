import { motion } from 'framer-motion';
import { Star, Shield, Package, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SellerProfileCardProps {
  seller: {
    name: string;
    avatar: string;
    rating: number;
    trustLevel: string;
    itemsListed: number;
    joinedDate: string;
    completedSales: number;
  };
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

export function SellerProfileCard({ seller, isOpen, onClose, position }: SellerProfileCardProps) {
  if (!isOpen) return null;

  const getTrustColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'verified': return 'bg-success text-success-foreground';
      case 'trusted': return 'bg-primary text-primary-foreground';
      case 'new': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="fixed z-50"
        style={{
          left: Math.min(position.x, window.innerWidth - 320),
          top: Math.min(position.y, window.innerHeight - 400),
        }}
      >
        <Card className="w-72 bg-gradient-card border-border shadow-elegant">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{seller.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">{seller.rating}/5</span>
                </div>
              </div>
              <Badge className={getTrustColor(seller.trustLevel)}>
                {seller.trustLevel}
              </Badge>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>Items Listed</span>
                </div>
                <span className="font-medium text-foreground">{seller.itemsListed}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Completed Sales</span>
                </div>
                <span className="font-medium text-foreground">{seller.completedSales}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Member Since</span>
                </div>
                <span className="font-medium text-foreground">{seller.joinedDate}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border">
              <Button size="sm" className="w-full bg-gradient-primary hover:opacity-90">
                View All Items
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}