import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Search, FileText } from "lucide-react";
import { SaleDetailsModal } from "@/components/modals/SaleDetailsModal";

export default function SalesList() {
  const { toast } = useToast();
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    setLoading(true);
    try {
      const data = await apiService.getSales();
      setSales(data || []);
    } catch (e) {
      toast({ title: "Error", description: "Failed to load sales", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiService.getSales({ customer_name: query });
      setSales(data || []);
    } catch (e) {
      toast({ title: "Error", description: "Failed to search sales", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-muted-foreground">Loading sales...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            Sales List
          </h1>
          <p className="text-muted-foreground mt-1">View and search past sales</p>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search by customer name" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Button type="submit" variant="outline">Search</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>All Sales ({sales.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sales.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50 cursor-pointer" onClick={() => setSelectedSaleId(s.id)}>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <div className="font-medium">{s.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{s.date}</div>
                </div>
                <div className="md:text-center">Items: {s.items_count || s.items?.length || 0}</div>
                <div className="md:text-center">Discount: ₹{s.discount || 0}</div>
                <div className="text-right font-semibold">₹{s.net_amount}</div>
              </div>
            </div>
          ))}
          {sales.length === 0 && (
            <p className="text-center text-muted-foreground py-6">No sales found</p>
          )}
        </CardContent>
      </Card>

      <SaleDetailsModal open={!!selectedSaleId} onOpenChange={() => setSelectedSaleId(null)} saleId={selectedSaleId} />
    </div>
  );
}


