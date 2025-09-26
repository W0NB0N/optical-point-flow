import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CustomerModal } from "@/components/modals/CustomerModal";
import { CustomerDetailsModal } from "@/components/modals/CustomerDetailsModal";
import { PrescriptionModal } from "@/components/modals/PrescriptionModal";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  MessageCircle, 
  Eye, 
  Edit, 
  Filter,
  Users
} from "lucide-react";

export default function Customers() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [showRxModal, setShowRxModal] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async (query = "") => {
    setLoading(true);
    try {
      const data = await apiService.getCustomers(query);
      setCustomers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await loadCustomers(searchQuery);
  };

  const handleAddSuccess = () => {
    loadCustomers(searchQuery);
    toast({ title: "Customer added successfully" });
  };

  const handleEditSuccess = () => {
    loadCustomers(searchQuery);
    setEditingCustomer(null);
    toast({ title: "Customer updated successfully" });
  };

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
    setShowDetailsModal(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-muted-foreground">Loading customers...</div>
      </div>
    );
  }

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
        <Button className="bg-gradient-primary hover:shadow-hover transition-all"
                onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search customers by name or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </form>
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
              <div key={customer.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all border border-border/50 cursor-pointer"
                   onClick={() => {
                     setSelectedCustomerId(customer.id);
                     setShowDetailsModal(true);
                   }}>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gender</p>
                    <p className="text-sm text-foreground">{customer.gender === 'M' ? 'Male' : customer.gender === 'F' ? 'Female' : 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Birth Date</p>
                    <p className="text-sm text-foreground">{customer.dob || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer ID</p>
                    <p className="text-sm font-semibold text-foreground">#{customer.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* <Badge variant="default">Active</Badge> */}
                  <div className="flex gap-1 ml-2">
                    <Button variant="ghost" size="sm" className="p-2" onClick={(e) => e.stopPropagation()}>
                      <MessageCircle className="w-4 h-4 text-success" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCustomerId(customer.id);
                      setShowDetailsModal(true);
                    }}>
                      <Eye className="w-4 h-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2" onClick={(e) => {
                      e.stopPropagation();
                      setEditingCustomer(customer);
                    }}>
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button variant="outline" size="sm" className="p-2" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCustomerId(customer.id);
                      setShowRxModal(true);
                    }}>
                      Add Prescription
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {customers.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No customers found</p>
            )}
          </div>
        </CardContent>
      </Card>

      <CustomerModal 
        open={showAddModal || !!editingCustomer}
        onOpenChange={() => {
          setShowAddModal(false);
          setEditingCustomer(null);
        }}
        onSuccess={editingCustomer ? handleEditSuccess : handleAddSuccess}
        customer={editingCustomer}
      />

      <CustomerDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        customerId={selectedCustomerId}
        onEdit={handleEditCustomer}
      />

      <PrescriptionModal
        open={showRxModal}
        onOpenChange={setShowRxModal}
        customerId={selectedCustomerId}
        onSuccess={() => setShowRxModal(false)}
      />
    </div>
  );
}