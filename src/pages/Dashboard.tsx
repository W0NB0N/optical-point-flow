import { useEffect, useState } from "react";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SaleDetailsModal } from "@/components/modals/SaleDetailsModal";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar,
  Plus,
  MessageCircle,
  Eye,
  FileText
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const [salesSummary, setSalesSummary] = useState<any>(null);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [todayEvents, setTodayEvents] = useState<any>({ recalls: [], birthdays: [] });
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [summary, sales, events] = await Promise.all([
        apiService.getDashboardSalesSummary(),
        apiService.getDashboardRecentSales(),
        apiService.getDashboardEvents()
      ]);
      
      setSalesSummary(summary);
      setRecentSales(sales);
      setTodayEvents(events);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome Back!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening at Vision Point today</p>
        </div>
          <div className="flex gap-3">
            <Button 
              className="bg-gradient-primary hover:shadow-hover transition-all"
              onClick={() => window.location.href = '/add-sale'}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sale
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/customers'}
            >
              <Users className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Today's Sales"
          value={`₹${salesSummary?.today_sales?.toLocaleString() || '0'}`}
          change="Real-time data"
          changeType="positive"
          icon={<DollarSign className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="This Month"
          value={`₹${salesSummary?.this_month_sales?.toLocaleString() || '0'}`}
          change="Current month"
          changeType="positive"
          icon={<Calendar className="w-6 h-6 text-success" />}
        />
        <StatsCard
          title="Last Month"
          value={`₹${salesSummary?.last_month_sales?.toLocaleString() || '0'}`}
          change="Previous month"
          changeType="neutral"
          icon={<TrendingUp className="w-6 h-6 text-warning" />}
        />
        <StatsCard
          title="Recent Sales"
          value={recentSales.length.toString()}
          change="Latest transactions"
          changeType="positive"
          icon={<Users className="w-6 h-6 text-primary" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card className="shadow-card hover:shadow-hover transition-all">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Sales</CardTitle>
            <Button variant="ghost" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                     onClick={() => setSelectedSaleId(sale.id)}>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{sale.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{sale.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold text-foreground">₹{sale.net_amount?.toLocaleString()}</p>
                  </div>
                  <div className="ml-3 flex gap-1">
                    <Button variant="ghost" size="sm" className="p-1">
                      <MessageCircle className="w-4 h-4 text-success" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSaleId(sale.id);
                    }}>
                      <Eye className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                </div>
              ))}
              {recentSales.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No recent sales</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Events */}
        <Card className="shadow-card hover:shadow-hover transition-all">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Today's Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayEvents.recalls?.map((recall: any, index: number) => (
                <div key={`recall-${index}`} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="default">Recall</Badge>
                      <p className="font-medium text-foreground">{recall.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{recall.phone}</p>
                    <p className="text-xs text-muted-foreground mt-1">Follow-up due today</p>
                  </div>
                  <Button variant="ghost" size="sm" className="p-2">
                    <MessageCircle className="w-4 h-4 text-success" />
                  </Button>
                </div>
              ))}
              {todayEvents.birthdays?.map((birthday: any, index: number) => (
                <div key={`birthday-${index}`} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">Birthday</Badge>
                      <p className="font-medium text-foreground">{birthday.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{birthday.phone}</p>
                    <p className="text-xs text-muted-foreground mt-1">Birthday today! Send wishes</p>
                  </div>
                  <Button variant="ghost" size="sm" className="p-2">
                    <MessageCircle className="w-4 h-4 text-success" />
                  </Button>
                </div>
              ))}
            </div>
            {(!todayEvents.recalls?.length && !todayEvents.birthdays?.length) && (
              <p className="text-center text-muted-foreground py-8">No events for today</p>
            )}
          </CardContent>
        </Card>
      </div>

      <SaleDetailsModal 
        open={!!selectedSaleId} 
        onOpenChange={() => setSelectedSaleId(null)}
        saleId={selectedSaleId}
      />
    </div>
  );
}