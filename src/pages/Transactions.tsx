import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity, Search, ExternalLink, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface Transaction {
  id: string;
  hash: string;
  type: 'bid' | 'auction_created' | 'auction_ended' | 'payment';
  auctionTitle: string;
  amount: number;
  timestamp: Date;
  status: 'confirmed' | 'pending' | 'failed';
  blockNumber: number;
  gasUsed: string;
  from: string;
  to: string;
}

// Mock transaction data - replace with actual blockchain API calls
const mockTransactions: Transaction[] = [
  {
    id: '1',
    hash: '0x742d35cc6ab4c44ac4c3c4b0965d02c9f74f08e21a1e77c3b65e8d5a5f7c2b8d',
    type: 'bid',
    auctionTitle: 'Vintage Rolex Submariner',
    amount: 15500,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'confirmed',
    blockNumber: 18524671,
    gasUsed: '0.0023',
    from: '0x1234...5678',
    to: '0xabcd...efgh'
  },
  {
    id: '2',
    hash: '0x8f5e2a1b9c7d3e4f6a8b2c5d7e9f1a3b5c7d9e2f4a6b8c1d3e5f7a9b2c4d6e8f',
    type: 'auction_created',
    auctionTitle: 'Ferrari 250 GT Model',
    amount: 400,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: 'confirmed',
    blockNumber: 18524582,
    gasUsed: '0.0045',
    from: '0x1234...5678',
    to: '0x0000...0000'
  },
  {
    id: '3',
    hash: '0x3a7f9e2d4b8c1a5f6e9d2b7c4a8f1e3d5b9c2e6f8a1d4b7e9c2f5a8d1b4e7f9c',
    type: 'bid',
    auctionTitle: 'Original Van Gogh Sketch',
    amount: 125000,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    status: 'confirmed',
    blockNumber: 18524456,
    gasUsed: '0.0028',
    from: '0x1234...5678',
    to: '0xabcd...efgh'
  },
  {
    id: '4',
    hash: '0x9b6e4d2a7f5c8e1b4d7a9c2f6e8b1d4a7c9e2f5b8d1a4c7e9f2b5a8d1c4e7f9b',
    type: 'bid',
    auctionTitle: 'Antique Persian Rug',
    amount: 3200,
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
    status: 'pending',
    blockNumber: 0,
    gasUsed: '0.0021',
    from: '0x1234...5678',
    to: '0xabcd...efgh'
  }
];

const Transactions = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.auctionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.hash.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bid': return <DollarSign className="h-4 w-4" />;
      case 'auction_created': return <Activity className="h-4 w-4" />;
      case 'auction_ended': return <CheckCircle className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-accent text-accent-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bid': return 'Bid Placed';
      case 'auction_created': return 'Auction Created';
      case 'auction_ended': return 'Auction Ended';
      case 'payment': return 'Payment';
      default: return type;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInHours > 0) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInMinutes}m ago`;
    }
  };

  const totalValue = transactions
    .filter(tx => tx.status === 'confirmed')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const confirmedTxs = transactions.filter(tx => tx.status === 'confirmed').length;
  const pendingTxs = transactions.filter(tx => tx.status === 'pending').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Blockchain Transactions
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Complete transparency with immutable blockchain records
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-card border border-border rounded-lg p-6 text-center">
          <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{confirmedTxs}</div>
          <div className="text-sm text-muted-foreground">Confirmed Transactions</div>
        </div>
        <div className="bg-gradient-card border border-border rounded-lg p-6 text-center">
          <Clock className="h-8 w-8 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{pendingTxs}</div>
          <div className="text-sm text-muted-foreground">Pending Transactions</div>
        </div>
        <div className="bg-gradient-card border border-border rounded-lg p-6 text-center">
          <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Transaction Value</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-card border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by auction title or transaction hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-secondary border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="bid">Bids</option>
            <option value="auction_created">Auctions Created</option>
            <option value="auction_ended">Auctions Ended</option>
            <option value="payment">Payments</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map(transaction => (
          <Card key={transaction.id} className="bg-gradient-card border-border shadow-card hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    {getTypeIcon(transaction.type)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-foreground">{getTypeLabel(transaction.type)}</h3>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground">{transaction.auctionTitle}</p>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center space-x-4">
                        <span>Hash: {transaction.hash}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-0 h-auto text-primary hover:text-primary-glow"
                          onClick={() => window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                      <div>Block: {transaction.blockNumber > 0 ? transaction.blockNumber.toLocaleString() : 'Pending'}</div>
                      <div>Gas Used: {transaction.gasUsed} ETH</div>
                      <div>From: {transaction.from} → To: {transaction.to}</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ${transaction.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatTimeAgo(transaction.timestamp)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <div className="text-muted-foreground text-lg mb-2">No transactions found</div>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Transactions;