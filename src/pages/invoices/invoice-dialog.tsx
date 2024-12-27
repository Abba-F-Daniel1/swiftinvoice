// invoice-dialog.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Calculator, Upload, Receipt, Building2 } from "lucide-react";
import type { Client } from "@/types";

interface InvoiceItem {
  service_name: string;
  description: string;
  quantity: number;
  rate: number;
  amount?: number;
}

interface InvoiceFormData {
  client_id: string;
  items: InvoiceItem[];
  logo?: File;
}

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDialog({ open, onOpenChange }: InvoiceDialogProps) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      service_name: "",
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    },
  ]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => {
      const amount = item.quantity * item.rate;
      return sum + amount;
    }, 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + (newSubtotal * tax) / 100);
  }, [items, tax]);

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await api.get("/clients");
      return response.data;
    },
  });

  const { register, handleSubmit, reset, setValue } = useForm<InvoiceFormData>({
    defaultValues: {
      client_id: "",
      items: items,
    },
  });

  const createInvoice = useMutation({
    mutationFn: async (data: InvoiceFormData) => {
      const formData = new FormData();
      formData.append("client_id", data.client_id);
      formData.append("items", JSON.stringify(items));
      if (data.logo) {
        formData.append("logo", data.logo);
      }
      const response = await api.post("/invoices", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      reset();
      setItems([
        { service_name: "", description: "", quantity: 1, rate: 0, amount: 0 },
      ]);
      onOpenChange(false);
    },
  });

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      await createInvoice.mutate({
        ...data,
        items: items,
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      amount:
        field === "quantity" || field === "rate"
          ? (field === "quantity" ? value : newItems[index].quantity) *
            (field === "rate" ? value : newItems[index].rate)
          : newItems[index].amount,
    };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { service_name: "", description: "", quantity: 1, rate: 0, amount: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl dark:bg-slate-900 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Receipt className="h-5 w-5 text-primary" />
            <span className="dark:text-white">Create New Invoice</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-2">
              <Label htmlFor="client_id" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="dark:text-white">Select Client</span>
              </Label>
              <Select onValueChange={(value) => setValue("client_id", value)}>
                <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-800">
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} - {client.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo" className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" />
                <span className="dark:text-white">Company Logo</span>
              </Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => setValue("logo", e.target.files?.[0])}
                className="dark:bg-slate-800 dark:border-slate-700 file:bg-primary file:text-white file:border-0 file:px-4 file:py-2 file:mr-4 file:hover:bg-primary/90 transition-colors"
              />
            </div>
          </motion.div>

          {/* Items Table Header */}
          <motion.div 
            className="bg-muted dark:bg-slate-800 p-4 rounded-t-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-12 gap-4 font-medium text-sm dark:text-white">
              <div className="col-span-3">Service</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-1 text-right">Qty</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-1 text-right">Amount</div>
              <div className="col-span-1"></div>
            </div>
          </motion.div>

          {/* Items */}
          <div className="space-y-2">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  className="grid grid-cols-12 gap-4 items-center p-2 hover:bg-muted/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="col-span-3">
                    <Input
                      placeholder="Service name"
                      value={item.service_name}
                      onChange={(e) =>
                        updateItem(index, "service_name", e.target.value)
                      }
                      className="dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>

                  <div className="col-span-4">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                      className="dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>

                  <div className="col-span-1">
                    <Input
                      type="number"
                      min="1"
                      className="text-right dark:bg-slate-800 dark:border-slate-700"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", parseInt(e.target.value) || 0)
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <Input
                      type="number"
                      step="0.01"
                      className="text-right dark:bg-slate-800 dark:border-slate-700"
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(index, "rate", parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>

                  <div className="col-span-1 text-right font-medium dark:text-white">
                    {formatCurrency(item.quantity * item.rate)}
                  </div>

                  <div className="col-span-1 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="hover:bg-destructive/10 dark:hover:bg-destructive/20"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Totals */}
          <motion.div 
            className="border-t dark:border-slate-800 pt-4 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-end items-center gap-4 text-sm">
              <span className="font-medium dark:text-white">Subtotal:</span>
              <span className="w-32 text-right dark:text-slate-400">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex justify-end items-center gap-4 text-sm">
              <span className="font-medium dark:text-white">Tax ({tax}%):</span>
              <span className="w-32 text-right dark:text-slate-400">
                {formatCurrency((subtotal * tax) / 100)}
              </span>
            </div>
            <div className="flex justify-end items-center gap-4 text-base font-bold">
              <span className="dark:text-white">Total:</span>
              <span className="w-32 text-right dark:text-white">
                {formatCurrency(total)}
              </span>
            </div>
          </motion.div>

          <motion.div 
            className="flex justify-between pt-4 border-t dark:border-slate-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="gap-2 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
            <Button
              type="submit"
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Calculator className="h-4 w-4" />
              Generate Invoice
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
}