import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Trash2, Package, Wrench } from "lucide-react";

type ProductType = "lens" | "frame" | "contact" | "sunglass";

export default function Products() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ProductType | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([apiService.getProducts(), apiService.getServices()]);
      setProducts(p || []);
      setServices(s || []);
    } catch (e) {
      toast({ title: "Error", description: "Failed to load products/services", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return (products || []).filter((p: any) => {
      const matchesSearch = !search || `${p.name} ${p.type}`.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || p.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [products, search, typeFilter]);

  const handleDeleteProduct = async (id: number) => {
    try {
      await apiService.deleteProduct(id);
      toast({ title: "Deleted product" });
      loadData();
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      await apiService.deleteService(id);
      toast({ title: "Deleted service" });
      loadData();
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete service", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-muted-foreground">Loading products & services...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-8 h-8 text-primary" />
            Products & Services
          </h1>
          <p className="text-muted-foreground mt-1">Manage catalog and pricing</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={async () => {
            try {
              await apiService.addProduct({ name: "Demo Product", type: "lens", price: 0 });
              toast({ title: "Product added" });
              loadData();
            } catch {
              // Fallback to client list if backend not ready
              setProducts((prev) => [{ id: Date.now(), name: "Demo Product", type: "lens", price: 0 }, ...prev]);
              toast({ title: "Product added (local)" });
            }
          }}>
            <Plus className="w-4 h-4 mr-2" /> New Product
          </Button>
          <Button variant="outline" size="sm" onClick={async () => {
            try {
              await apiService.addService({ name: "Eye Testing", price: 0 });
              toast({ title: "Service added" });
              loadData();
            } catch {
              setServices((prev) => [{ id: Date.now(), name: "Eye Testing", price: 0 }, ...prev]);
              toast({ title: "Service added (local)" });
            }
          }}>
            <Plus className="w-4 h-4 mr-2" /> New Service
          </Button>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search products/services" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Product Type</Label>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="lens">Lens</SelectItem>
                  <SelectItem value="frame">Frame</SelectItem>
                  <SelectItem value="contact">Contact Lenses</SelectItem>
                  <SelectItem value="sunglass">Sunglasses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Item</span>
              <span>Type / Price</span>
            </div>
            {filteredProducts.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="col-span-2">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">SKU: {p.sku || p.id}</div>
                  </div>
                  <div>
                    <Badge variant="secondary">{p.type}</Badge>
                  </div>
                  <div className="text-right font-semibold">₹{p.price}</div>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteProduct(p.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <p className="text-center text-muted-foreground py-6">No products found</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Services ({services.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Service</span>
              <span>Price</span>
            </div>
            {(services || []).map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.description || "Service"}</div>
                  </div>
                  <div className="text-right font-semibold">₹{s.price}</div>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteService(s.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {services.length === 0 && (
              <p className="text-center text-muted-foreground py-6">No services found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


