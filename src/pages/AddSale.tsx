import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { PrescriptionModal } from "@/components/modals/PrescriptionModal";
import { CustomerModal } from "@/components/modals/CustomerModal";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerResults, setCustomerResults] = useState<any[]>([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [discountPct, setDiscountPct] = useState(0);
  const [received, setReceived] = useState(0);
  const [showRx, setShowRx] = useState(false);

  const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0) +
                  services.reduce((sum, service) => sum + service.price, 0);
  const discount = Math.max(0, Math.min(100, discountPct)) * subtotal / 100;
  const netAmount = Math.max(0, subtotal - discount);
  const dueAmount = Math.max(0, netAmount - received);

  // backend search customers with debounce
  useEffect(() => {
    const controller = new AbortController();
    const handler = setTimeout(async () => {
      const q = customerQuery.trim();
      if (!q) {
        setCustomerResults([]);
        return;
      }
      try {
        const data = await (await import("@/lib/api")).apiService.getCustomers(q);
        setCustomerResults(Array.isArray(data) ? data : []);
      } catch {
        setCustomerResults([]);
      }
    }, 300);
    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [customerQuery]);

  const ensureCustomerSelected = () => {
    if (!selectedCustomer) {
      toast({ title: "Select a customer first", description: "Choose an existing customer or add a new one." });
      return false;
    }
    return true;
  };

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
      price: 0
    };
    setServices([...services, newService]);
  };

  const updateProduct = (id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const updateService = (id: string, patch: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const removeProduct = (id: string) => setProducts((prev) => prev.filter((p) => p.id !== id));
  const removeService = (id: string) => setServices((prev) => prev.filter((s) => s.id !== id));

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
          <Button className="bg-gradient-success text-success-foreground hover:shadow-hover">
            Save
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
                    value={customerQuery}
                    onChange={(e) => setCustomerQuery(e.target.value)}
                    autoComplete="off"
                  />
                  {customerQuery && (
                    <div className="absolute z-20 mt-1 w-full rounded-md border border-border bg-card shadow-card max-h-60 overflow-auto">
                      {customerResults.length === 0 && (
                        <div className="px-3 py-2 text-sm text-muted-foreground">No matches</div>
                      )}
                      {customerResults.map((c) => (
                        <button
                          type="button"
                          key={c.id}
                          className="w-full text-left px-3 py-2 hover:bg-secondary"
                          onClick={() => {
                            setSelectedCustomer(c);
                            setCustomerQuery(`${c.name} - ${c.phone}`);
                            setCustomerResults([]);
                          }}
                        >
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.phone}</div>
                        </button>
                      ))}
                      <div className="border-t border-border" />
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-secondary text-primary"
                        onClick={() => {
                          setShowCustomerModal(true);
                          setCustomerResults([]);
                        }}
                      >
                        + Create new customer "{customerQuery}"
                      </button>
                    </div>
                  )}
                </div>
                <Button variant="outline" onClick={() => setShowCustomerModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
                <Button variant="outline" onClick={() => setShowRx(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Prescription
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
                <Button variant="outline" size="sm" onClick={() => { if (ensureCustomerSelected()) addProduct(); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Product
                </Button>
                <Button variant="outline" size="sm" onClick={() => { if (ensureCustomerSelected()) addService(); }}>
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
                    <Input placeholder="Product name" value={product.name} onChange={(e) => updateProduct(product.id, { name: e.target.value })} />
                    <div>
                      <Select value={product.type} onValueChange={(v) => updateProduct(product.id, { type: v as Product["type"] })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lens">Lens</SelectItem>
                          <SelectItem value="frame">Frame</SelectItem>
                          <SelectItem value="contact">Contact Lenses</SelectItem>
                          <SelectItem value="sunglass">Sunglasses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input type="number" min={0} step={50} placeholder="Price" value={product.price}
                      onChange={(e) => updateProduct(product.id, { price: Math.max(0, Number(e.target.value)) })}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          updateProduct(product.id, { price: product.price + 50 });
                        } else if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          updateProduct(product.id, { price: Math.max(0, product.price - 50) });
                        }
                      }}
                    />
                    <Input type="number" min={0} step={1} placeholder="Qty" value={product.quantity} onChange={(e) => updateProduct(product.id, { quantity: Math.max(0, Number(e.target.value)) })} />
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeProduct(product.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {/* Services List */}
              {services.map((service) => (
                <div key={service.id} className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <Input placeholder="Service name" value={service.name} onChange={(e) => updateService(service.id, { name: e.target.value })} />
                    <div>
                      <Select value={service.name.toLowerCase().includes('repair') ? 'repair' : 'eye_testing'} onValueChange={(v) => updateService(service.id, { name: v === 'repair' ? 'Repair' : 'Eye Testing' })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Service Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eye_testing">Eye Testing</SelectItem>
                          <SelectItem value="repair">Repair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input type="number" min={0} step={50} placeholder="Price" value={service.price}
                      onChange={(e) => updateService(service.id, { price: Math.max(0, Number(e.target.value)) })}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          updateService(service.id, { price: service.price + 50 });
                        } else if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          updateService(service.id, { price: Math.max(0, service.price - 50) });
                        }
                      }}
                    />
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeService(service.id)}>
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
                <div className="flex justify-between text-sm"><span>Total quantity</span><span>{products.reduce((s, p) => s + p.quantity, 0)}</span></div>
                <div className="flex justify-between text-sm"><span>Total price</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input id="discount" type="number" min={0} max={100} step={1} placeholder="0" className="w-24 text-right" value={discountPct} onChange={(e) => setDiscountPct(Math.max(0, Math.min(100, Number(e.target.value))))} />
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Net amount</span>
                  <span className="text-primary">₹{netAmount.toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Payment Method</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">Cash</Button>
                  <Button variant="outline" size="sm">Card</Button>
                  <Button variant="outline" size="sm">UPI</Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="received">Amount Received</Label>
                  <Input id="received" type="text" inputMode="decimal" pattern="[0-9]*" placeholder="0" value={String(received)} onChange={(e) => {
                    const sanitized = e.target.value.replace(/[^0-9.]/g, "");
                    setReceived(Math.max(0, Number(sanitized || 0)));
                  }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due">Due Amount</Label>
                  <Input id="due" type="number" placeholder="0" className="bg-muted" readOnly value={dueAmount} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <PrescriptionModal open={showRx} onOpenChange={setShowRx} customerId={selectedCustomer ? selectedCustomer.id : null} onSuccess={() => setShowRx(false)} />
      <CustomerModal
        open={showCustomerModal}
        onOpenChange={(open) => {
          setShowCustomerModal(open);
          if (!open) setCustomerQuery("");
        }}
        onSuccess={async () => {
          setShowCustomerModal(false);
          // reload search with current query to pick newly created
          if (customerQuery) {
            try {
              const data = await (await import("@/lib/api")).apiService.getCustomers(customerQuery);
              setCustomerResults(Array.isArray(data) ? data : []);
              if (data && data.length) {
                setSelectedCustomer(data[0]);
                setCustomerQuery(`${data[0].name} - ${data[0].phone}`);
              }
            } catch {}
          }
        }}
      />
    </div>
  );
}