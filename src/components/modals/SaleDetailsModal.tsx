import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiService } from "@/lib/api";
import { MessageCircle, Eye } from "lucide-react";

interface SaleDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleId: number | null;
}

export function SaleDetailsModal({ open, onOpenChange, saleId }: SaleDetailsModalProps) {
  const [sale, setSale] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && saleId) {
      loadSaleDetails();
    }
  }, [open, saleId]);

  const loadSaleDetails = async () => {
    setLoading(true);
    try {
      const saleData = await apiService.getSale(saleId!);
      setSale(saleData);
    } catch (error) {
      console.error("Failed to load sale details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Sale Details #{saleId}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-muted-foreground">Loading sale details...</div>
          </div>
        ) : sale ? (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{sale.customer_name}</h3>
                <p className="text-sm text-muted-foreground">{sale.customer_phone}</p>
                <p className="text-sm text-muted-foreground">Date: {sale.date}</p>
                {sale.recall_date && (
                  <p className="text-sm text-muted-foreground">Recall: {sale.recall_date}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <MessageCircle className="w-4 h-4 text-success" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 text-primary" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Sale Items */}
            <div>
              <h4 className="font-semibold mb-3">Items & Services</h4>
              <div className="space-y-2">
                {sale.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium">{item.product_name || item.service_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                      {item.note && (
                        <p className="text-xs text-muted-foreground mt-1">{item.note}</p>
                      )}
                    </div>
                    <div className="font-semibold">₹{item.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Payment Summary */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span>₹{sale.total_amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>₹{sale.discount}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Net Amount:</span>
                <span className="text-primary">₹{sale.net_amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Received:</span>
                <span>₹{sale.received_amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Balance:</span>
                <span className={sale.remaining_amount > 0 ? "text-destructive" : "text-success"}>
                  ₹{sale.remaining_amount}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex justify-center">
              <Badge variant={sale.status === "completed" ? "default" : "secondary"}>
                {sale.status?.toUpperCase()}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-8">
            <div className="text-muted-foreground">Failed to load sale details</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}