import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  MessageCircle, 
  Eye, 
  Edit, 
  Filter,
  Users
} from "lucide-react";

const customers = [
  {
    id: "1",
    name: "John Smith",
    phone: "+91 98765 43210",
    gender: "Male",
    birthdate: "1985-06-15",
    lastVisit: "2024-01-10",
    totalSales: "₹8,450",
    status: "Active"
  },
  {
    id: "2",
    name: "Maria Garcia", 
    phone: "+91 87654 32109",
    gender: "Female",
    birthdate: "1992-03-22",
    lastVisit: "2024-01-12",
    totalSales: "₹5,670",
    status: "Active"
  },
  {
    id: "3",
    name: "David Wilson",
    phone: "+91 76543 21098", 
    gender: "Male",
    birthdate: "1978-11-08",
    lastVisit: "2024-01-08",
    totalSales: "₹12,340",
    status: "Active"
  },
  {
    id: "4",
    name: "Sarah Johnson",
    phone: "+91 65432 10987",
    gender: "Female", 
    birthdate: "1990-09-14",
    lastVisit: "2023-12-20",
    totalSales: "₹3,200",
    status: "Inactive"
  }
];

export default function Customers() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Customers
          </h1>
          <p className="text-muted-foreground mt-1">Manage your customer database</p>
        </div>
        <Button className="bg-gradient-primary hover:shadow-hover transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search customers by name or phone..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>All Customers ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all border border-border/50">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gender</p>
                    <p className="text-sm text-foreground">{customer.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Visit</p>
                    <p className="text-sm text-foreground">{customer.lastVisit}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                    <p className="text-sm font-semibold text-foreground">{customer.totalSales}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                    {customer.status}
                  </Badge>
                  <div className="flex gap-1 ml-2">
                    <Button variant="ghost" size="sm" className="p-2">
                      <MessageCircle className="w-4 h-4 text-success" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Eye className="w-4 h-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}