// view-invoice-dialog.tsx
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Receipt, Calendar, Building2, Mail } from "lucide-react";
import type { Invoice } from "@/types";

interface ViewInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice;
}

export function ViewInvoiceDialog({
  open,
  onOpenChange,
  invoice,
}: ViewInvoiceDialogProps) {
  const total = invoice.items?.reduce((sum, item) => sum + item.quantity * item.rate, 0) || 0;

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl dark:bg-slate-900 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Receipt className="h-5 w-5 text-primary" />
                <span className="dark:text-white">Invoice Details</span>
              </DialogTitle>
            </DialogHeader>

            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {/* Header Info */}
              <div className="flex justify-between items-start bg-muted/50 dark:bg-slate-800/50 p-4 rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium dark:text-white flex items-center gap-2">
                    <span className="text-primary">#</span>{invoice.id}
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-slate-400 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(invoice.created_at)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(invoice.status)} text-sm px-3 py-1`}
                >
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Badge>
              </div>

              {/* Client Info */}
              <motion.div 
                className="border dark:border-slate-800 rounded-lg p-4 space-y-3"
                whileHover={{ scale: 1.01 }}
              >
                <h3 className="font-medium dark:text-white flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Client Information
                </h3>
                <div className="text-sm space-y-2 pl-6">
                  <p className="font-medium dark:text-white">{invoice.client?.name}</p>
                  <p className="text-muted-foreground dark:text-slate-400">{invoice.client?.company}</p>
                  <p className="text-muted-foreground dark:text-slate-400 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {invoice.client?.email}
                  </p>
                </div>
              </motion.div>

              {/* Items */}
              <div className="border dark:border-slate-800 rounded-lg overflow-hidden">
                <div className="bg-muted dark:bg-slate-800 p-4">
                  <h3 className="font-medium dark:text-white">Items</h3>
                </div>
                <div className="divide-y dark:divide-slate-800">
                  {invoice.items?.map((item, index) => (
                    <motion.div
                      key={index}
                      className="p-4 hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="grid grid-cols-12 gap-4 text-sm">
                        <div className="col-span-6">
                          <p className="font-medium dark:text-white">{item.service_name}</p>
                          <p className="text-muted-foreground dark:text-slate-400">{item.description}</p>
                        </div>
                        <div className="col-span-2 text-right dark:text-slate-400">{item.quantity}x</div>
                        <div className="col-span-2 text-right dark:text-slate-400">
                          {formatCurrency(item.rate)}
                        </div>
                        <div className="col-span-2 text-right font-medium dark:text-white">
                          {formatCurrency(item.quantity * item.rate)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <motion.div 
                className="border-t dark:border-slate-800 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex justify-end text-sm">
                  <div className="w-48 space-y-2 bg-muted dark:bg-slate-800 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium dark:text-white">Total:</span>
                      <span className="dark:text-white">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "draft":
      return "bg-muted text-muted-foreground dark:bg-slate-800 dark:text-slate-400";
    case "sent":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    case "paid":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case "overdue":
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-muted dark:bg-slate-800";
  }
}