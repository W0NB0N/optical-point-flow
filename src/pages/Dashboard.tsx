import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const recentSales = [
  {
    id: "1",
    customer: "John Smith",
    phone: "+91 98765 43210",
    amount: "₹2,450",
    date: "Today",
    recallDate: "2024-01-15",
    status: "Completed"
  },
  {
    id: "2", 
    customer: "Maria Garcia",
    phone: "+91 87654 32109",
    amount: "₹1,850",
    date: "Yesterday",
    recallDate: "2024-01-20",
    status: "Pending"
  },
  {
    id: "3",
    customer: "David Wilson",
    phone: "+91 76543 21098",
    amount: "₹3,200",
    date: "2 days ago",
    recallDate: "2024-01-18",
    status: "Completed"
  }
];

const todayEvents = [
  {
    type: "recall",
    customer: "Sarah Johnson",
    phone: "+91 65432 10987",
    message: "Frame adjustment due today"
  },
  {
    type: "birthday",
    customer: "Michael Brown",
    phone: "+91 54321 09876",
    message: "Birthday today! Send wishes"
  }
];

export default function Dashboard() {
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
          value="₹12,450"
          change="+12% from yesterday"
          changeType="positive"
          icon={<DollarSign className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="This Week"
          value="₹45,230"
          change="+8% from last week"
          changeType="positive"
          icon={<TrendingUp className="w-6 h-6 text-success" />}
        />
        <StatsCard
          title="This Month"
          value="₹1,85,670"
          change="+15% from last month"
          changeType="positive"
          icon={<Calendar className="w-6 h-6 text-warning" />}
        />
        <StatsCard
          title="Total Customers"
          value="248"
          change="+5 new this week"
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
                <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{sale.customer}</p>
                    <p className="text-sm text-muted-foreground">{sale.phone}</p>
                    <p className="text-xs text-muted-foreground">Recall: {sale.recallDate}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold text-foreground">{sale.amount}</p>
                    <Badge variant={sale.status === "Completed" ? "default" : "secondary"}>
                      {sale.status}
                    </Badge>
                  </div>
                  <div className="ml-3 flex gap-1">
                    <Button variant="ghost" size="sm" className="p-1">
                      <MessageCircle className="w-4 h-4 text-success" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1">
                      <Eye className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                </div>
              ))}
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
              {todayEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={event.type === "recall" ? "default" : "secondary"}>
                        {event.type === "recall" ? "Recall" : "Birthday"}
                      </Badge>
                      <p className="font-medium text-foreground">{event.customer}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.phone}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.message}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="p-2">
                    <MessageCircle className="w-4 h-4 text-success" />
                  </Button>
                </div>
              ))}
            </div>
            {todayEvents.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No events for today</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}