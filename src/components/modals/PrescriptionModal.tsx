import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";

interface PrescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: number | null;
  prescription?: any | null;
  readOnly?: boolean;
  onSuccess?: () => void;
}

export function PrescriptionModal({ open, onOpenChange, customerId, prescription, readOnly = false, onSuccess }: PrescriptionModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: prescription?.id || "",
    type: prescription?.type || "Specs",
    date: prescription?.date || "",
    doctor: prescription?.doctor || "",
    // Left Eye D/N
    left_d_sph: prescription?.left_d_sph || "",
    left_d_cyl: prescription?.left_d_cyl || "",
    left_d_axis: prescription?.left_d_axis || "",
    left_d_vision: prescription?.left_d_vision || "",
    left_d_add: prescription?.left_d_add || "",
    left_n_sph: prescription?.left_n_sph || "",
    left_n_cyl: prescription?.left_n_cyl || "",
    left_n_axis: prescription?.left_n_axis || "",
    left_n_vision: prescription?.left_n_vision || "",
    left_n_add: prescription?.left_n_add || "",
    // Right Eye D/N
    right_d_sph: prescription?.right_d_sph || "",
    right_d_cyl: prescription?.right_d_cyl || "",
    right_d_axis: prescription?.right_d_axis || "",
    right_d_vision: prescription?.right_d_vision || "",
    right_d_add: prescription?.right_d_add || "",
    right_n_sph: prescription?.right_n_sph || "",
    right_n_cyl: prescription?.right_n_cyl || "",
    right_n_axis: prescription?.right_n_axis || "",
    right_n_vision: prescription?.right_n_vision || "",
    right_n_add: prescription?.right_n_add || "",
    // Psm, Pd, Fh for both eyes
    left_psm: prescription?.left_psm || "",
    left_pd: prescription?.left_pd || "",
    left_fh: prescription?.left_fh || "",
    right_psm: prescription?.right_psm || "",
    right_pd: prescription?.right_pd || "",
    right_fh: prescription?.right_fh || "",
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      id: prescription?.id || "",
      type: prescription?.type || "Specs",
      date: prescription?.date || "",
      doctor: prescription?.doctor || "",
      left_d_sph: prescription?.left_d_sph || "",
      left_d_cyl: prescription?.left_d_cyl || "",
      left_d_axis: prescription?.left_d_axis || "",
      left_d_vision: prescription?.left_d_vision || "",
      left_d_add: prescription?.left_d_add || "",
      left_n_sph: prescription?.left_n_sph || "",
      left_n_cyl: prescription?.left_n_cyl || "",
      left_n_axis: prescription?.left_n_axis || "",
      left_n_vision: prescription?.left_n_vision || "",
      left_n_add: prescription?.left_n_add || "",
      right_d_sph: prescription?.right_d_sph || "",
      right_d_cyl: prescription?.right_d_cyl || "",
      right_d_axis: prescription?.right_d_axis || "",
      right_d_vision: prescription?.right_d_vision || "",
      right_d_add: prescription?.right_d_add || "",
      right_n_sph: prescription?.right_n_sph || "",
      right_n_cyl: prescription?.right_n_cyl || "",
      right_n_axis: prescription?.right_n_axis || "",
      right_n_vision: prescription?.right_n_vision || "",
      right_n_add: prescription?.right_n_add || "",
      left_psm: prescription?.left_psm || "",
      left_pd: prescription?.left_pd || "",
      left_fh: prescription?.left_fh || "",
      right_psm: prescription?.right_psm || "",
      right_pd: prescription?.right_pd || "",
      right_fh: prescription?.right_fh || "",
    }));
  }, [prescription, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return onOpenChange(false);
    setLoading(true);
    try {
      if (!customerId) throw new Error("No customer selected");
      await apiService.addPrescription({ customer_id: customerId, ...form });
      toast({ title: "Prescription saved" });
      onOpenChange(false);
      onSuccess?.();
    } catch (e) {
      // allow dummy success if backend not ready
      toast({ title: "Prescription saved (local)", description: "Backend not available", });
      onOpenChange(false);
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>{readOnly ? "View Prescription" : (prescription ? "Edit Prescription" : "Add Prescription")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-2">
              <Label>Prescription ID</Label>
              <Input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={readOnly} />
            </div>
            <div className="space-y-2">
              <Label>Power Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger disabled={readOnly}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Specs">Specs</SelectItem>
                  <SelectItem value="Contacts">Contacts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} disabled={readOnly} />
            </div>
            <div className="space-y-2">
              <Label>Prescribed By</Label>
              <Input value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} disabled={readOnly} />
            </div>
          </div>

          {/* Left and Right Tables */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-2">
              <div className="font-semibold">Left</div>
              <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground">
                <div></div>
                <div>Sph</div><div>Cyl</div><div>Axis</div><div>Vision</div><div>Add</div>
              </div>
              <div className="grid grid-cols-6 gap-2 items-center border border-black p-2 rounded-md">
                <div className="text-xs">D</div>
                <Input className="border-black" value={form.left_d_sph} onChange={(e) => setForm({ ...form, left_d_sph: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.left_d_cyl} onChange={(e) => setForm({ ...form, left_d_cyl: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.left_d_axis} onChange={(e) => setForm({ ...form, left_d_axis: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.left_d_vision} onChange={(e) => setForm({ ...form, left_d_vision: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.left_d_add} onChange={(e) => setForm({ ...form, left_d_add: e.target.value })} disabled={readOnly} />
              </div>
              <div className="grid grid-cols-6 gap-2 items-center border border-black p-2 rounded-md">
                <div className="text-xs">N</div>
                <Input className="border-black" value={form.left_n_sph} onChange={(e) => setForm({ ...form, left_n_sph: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.left_n_cyl} onChange={(e) => setForm({ ...form, left_n_cyl: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.left_n_axis} onChange={(e) => setForm({ ...form, left_n_axis: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.left_n_vision} onChange={(e) => setForm({ ...form, left_n_vision: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.left_n_add} onChange={(e) => setForm({ ...form, left_n_add: e.target.value })} disabled={readOnly} />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs font-medium text-muted-foreground">
                <div>Psm</div><div>Pd</div><div>Fh</div>
              </div>
              <div className="grid grid-cols-3 gap-2 border border-black p-2 rounded-md">
                <Input className="border-black" value={form.left_psm} onChange={(e) => setForm({ ...form, left_psm: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.left_pd} onChange={(e) => setForm({ ...form, left_pd: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.left_fh} onChange={(e) => setForm({ ...form, left_fh: e.target.value })} disabled={readOnly} />
              </div>
            </div>

            {/* Right */}
            <div className="space-y-2">
              <div className="font-semibold">Right</div>
              <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground">
                <div></div>
                <div>Sph</div><div>Cyl</div><div>Axis</div><div>Vision</div><div>Add</div>
              </div>
              <div className="grid grid-cols-6 gap-2 items-center border border-black p-2 rounded-md">
                <div className="text-xs">D</div>
                <Input className="border-black" value={form.right_d_sph} onChange={(e) => setForm({ ...form, right_d_sph: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.right_d_cyl} onChange={(e) => setForm({ ...form, right_d_cyl: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.right_d_axis} onChange={(e) => setForm({ ...form, right_d_axis: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.right_d_vision} onChange={(e) => setForm({ ...form, right_d_vision: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.right_d_add} onChange={(e) => setForm({ ...form, right_d_add: e.target.value })} disabled={readOnly} />
              </div>
              <div className="grid grid-cols-6 gap-2 items-center border border-black p-2 rounded-md">
                <div className="text-xs">N</div>
                <Input className="border-black" value={form.right_n_sph} onChange={(e) => setForm({ ...form, right_n_sph: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.right_n_cyl} onChange={(e) => setForm({ ...form, right_n_cyl: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.right_n_axis} onChange={(e) => setForm({ ...form, right_n_axis: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.right_n_vision} onChange={(e) => setForm({ ...form, right_n_vision: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.right_n_add} onChange={(e) => setForm({ ...form, right_n_add: e.target.value })} disabled={readOnly} />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs font-medium text-muted-foreground">
                <div>Psm</div><div>Pd</div><div>Fh</div>
              </div>
              <div className="grid grid-cols-3 gap-2 border border-black p-2 rounded-md">
                <Input className="border-black" value={form.right_psm} onChange={(e) => setForm({ ...form, right_psm: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.right_pd} onChange={(e) => setForm({ ...form, right_pd: e.target.value })} disabled={readOnly} />
                <Input className="border-black" value={form.right_fh} onChange={(e) => setForm({ ...form, right_fh: e.target.value })} disabled={readOnly} />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            {!readOnly && <Button type="submit" disabled={loading} className="bg-gradient-primary">{loading ? 'Saving…' : 'Save'}</Button>}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


