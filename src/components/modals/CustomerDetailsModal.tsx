import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiService } from "@/lib/api";
import { MessageCircle, Edit, Calendar } from "lucide-react";

interface CustomerDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: number | null;
  onEdit?: (customer: any) => void;
}

export function CustomerDetailsModal({ open, onOpenChange, customerId, onEdit }: CustomerDetailsModalProps) {
  const [customer, setCustomer] = useState<any>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && customerId) {
      loadCustomerDetails();
    }
  }, [open, customerId]);

  const loadCustomerDetails = async () => {
    setLoading(true);
    try {
      const [customerData, prescriptionData] = await Promise.all([
        apiService.getCustomer(customerId!),
        apiService.getCustomerPrescriptions(customerId!)
      ]);
      setCustomer(customerData);
      setPrescriptions(prescriptionData);
    } catch (error) {
      console.error("Failed to load customer details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-muted-foreground">Loading customer details...</div>
          </div>
        ) : customer ? (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{customer.name}</h3>
                <p className="text-muted-foreground">{customer.phone}</p>
                <div className="flex gap-4 mt-2">
                  {customer.gender && (
                    <Badge variant="secondary">{customer.gender === 'M' ? 'Male' : 'Female'}</Badge>
                  )}
                  {customer.dob && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {customer.dob}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <MessageCircle className="w-4 h-4 text-success" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit?.(customer)}>
                  <Edit className="w-4 h-4 text-primary" />
                </Button>
              </div>
            </div>

            {customer.notes && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{customer.notes}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Prescriptions */}
            <div>
              <h4 className="font-semibold mb-3">Prescriptions ({prescriptions.length})</h4>
              {prescriptions.length > 0 ? (
                <div className="space-y-3">
                  {prescriptions.map((prescription: any) => (
                    <div key={prescription.id} className="p-3 bg-secondary/30 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline">{prescription.type}</Badge>
                        <span className="text-sm text-muted-foreground">{prescription.date}</span>
                      </div>
                      {prescription.doctor && (
                        <p className="text-sm text-muted-foreground mb-2">Dr. {prescription.doctor}</p>
                      )}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Left: </span>
                          <span>{prescription.sph_left || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Right: </span>
                          <span>{prescription.sph_right || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No prescriptions found</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-8">
            <div className="text-muted-foreground">Failed to load customer details</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}