import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Search, 
  Eye,
  Trash2,
  Calculator,
  FileText,
  User,
  ShoppingCart
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  type: "lens" | "frame" | "sunglass" | "contact";
  price: number;
  quantity: number;
}

interface Service {
  id: string;
  name: string;
  price: number;
}

export default function AddSale() {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [discount, setDiscount] = useState(0);

  const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0) +
                  services.reduce((sum, service) => sum + service.price, 0);
  const netAmount = subtotal - discount;

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "New Product",
      type: "lens",
      price: 0,
      quantity: 1
    };
    setProducts([...products, newProduct]);
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: "Eye Testing",
      price: 500
    };
    setServices([...services, newService]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-primary" />
            Add Sale
          </h1>
          <p className="text-muted-foreground mt-1">Create a new sale transaction</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Draft
          </Button>
          <Button className="bg-gradient-primary hover:shadow-hover transition-all">
            <Calculator className="w-4 h-4 mr-2" />
            Finalize Bill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search customer by name or phone..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </div>
              
              {selectedCustomer && (
                <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{selectedCustomer.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View History
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Products & Services</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={addProduct}>
                  <Plus className="w-4 h-4 mr-2" />
                  Product
                </Button>
                <Button variant="outline" size="sm" onClick={addService}>
                  <Plus className="w-4 h-4 mr-2" />
                  Service
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Products List */}
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg border border-border/30">
                  <div className="flex-1 grid grid-cols-4 gap-3">
                    <Input placeholder="Product name" defaultValue={product.name} />
                    <div>
                      <Badge variant="secondary">{product.type}</Badge>
                    </div>
                    <Input type="number" placeholder="Price" defaultValue={product.price} />
                    <Input type="number" placeholder="Qty" defaultValue={product.quantity} />
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {/* Services List */}
              {services.map((service) => (
                <div key={service.id} className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <Input placeholder="Service name" defaultValue={service.name} />
                    <div>
                      <Badge variant="outline" className="border-success text-success">Service</Badge>
                    </div>
                    <Input type="number" placeholder="Price" defaultValue={service.price} />
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {products.length === 0 && services.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No products or services added yet</p>
                  <p className="text-sm">Click the buttons above to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Panel */}
        <div className="space-y-6">
          <Card className="shadow-card sticky top-6">
            <CardHeader>
              <CardTitle>Bill Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Items ({products.length + services.length})</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="discount">Discount</Label>
                  <Input 
                    id="discount"
                    type="number" 
                    placeholder="0"
                    className="w-20 text-right"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Net Amount</span>
                  <span className="text-primary">₹{netAmount.toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Payment Details</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">Cash</Button>
                  <Button variant="outline" size="sm">Card</Button>
                  <Button variant="outline" size="sm">UPI</Button>
                  <Button variant="outline" size="sm">Bank</Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="received">Amount Received</Label>
                  <Input id="received" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due">Due Amount</Label>
                  <Input id="due" type="number" placeholder="0" className="bg-muted" readOnly />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button className="w-full bg-gradient-success text-success-foreground hover:shadow-hover">
                  Save & Print Bill
                </Button>
                <Button variant="outline" className="w-full">
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}