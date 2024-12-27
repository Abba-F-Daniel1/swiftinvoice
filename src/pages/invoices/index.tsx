import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Download, Trash2, Eye, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { InvoiceDialog } from "./invoice-dialog";
import { ViewInvoiceDialog } from "./view-invoice-dialog";
import { api } from "@/lib/axios";
import { formatDate, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Invoice } from "@/types";

function Invoices() {
  const [open, setOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const queryClient = useQueryClient();

  const { data: invoices, isLoading } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await api.get("/invoices");
      return response.data || [];
    },
  });

  const deleteInvoice = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice deleted successfully");
      setIsDeleteOpen(false);
      setSelectedInvoice(null);
    },
    onError: () => {
      toast.error("Failed to delete invoice");
    },
  });

  const updateInvoiceStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.patch(`/invoices/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice status updated");
    },
    onError: () => {
      toast.error("Failed to update invoice status");
    },
  });

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const getStatusColor = (status: string) => {
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
  };

  const columns = [
    {
      accessorKey: "id",
      header: "Invoice ID",
      cell: ({ row }) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium dark:text-white"
        >
          #{row.original?.id || "N/A"}
        </motion.div>
      ),
    },
    {
      accessorKey: "client.name",
      header: "Client Name",
      cell: ({ row }) => {
        const invoice = row.original as Invoice;
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-medium dark:text-white"
          >
            {invoice?.client?.name || "N/A"}
          </motion.div>
        );
      },
    },
    {
      accessorKey: "total",
      header: "Amount",
      cell: ({ row }) => {
        const invoice = row.original as Invoice;
        const total = invoice.items?.reduce(
          (sum, item) => sum + item.quantity * item.rate,
          0
        );
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-right font-medium dark:text-emerald-400"
          >
            {formatCurrency(total || 0)}
          </motion.div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => {
        const invoice = row.original as Invoice;
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground dark:text-slate-400"
          >
            {invoice?.created_at ? formatDate(invoice.created_at) : "N/A"}
          </motion.div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const invoice = row.original as Invoice;
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-[110px] justify-start px-3 ${getStatusColor(
                    invoice.status
                  )}`}
                >
                  <Badge variant="outline" className="font-normal">
                    {invoice.status.charAt(0).toUpperCase() +
                      invoice.status.slice(1)}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="dark:bg-slate-800 dark:border-slate-700"
              >
                <DropdownMenuItem
                  onClick={() =>
                    updateInvoiceStatus.mutate({
                      id: invoice.id,
                      status: "draft",
                    })
                  }
                  className="dark:hover:bg-slate-700"
                >
                  Mark as Draft
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateInvoiceStatus.mutate({
                      id: invoice.id,
                      status: "sent",
                    })
                  }
                  className="dark:hover:bg-slate-700"
                >
                  Mark as Sent
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateInvoiceStatus.mutate({
                      id: invoice.id,
                      status: "paid",
                    })
                  }
                  className="dark:hover:bg-slate-700"
                >
                  Mark as Paid
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateInvoiceStatus.mutate({
                      id: invoice.id,
                      status: "overdue",
                    })
                  }
                  className="dark:hover:bg-slate-700"
                >
                  Mark as Overdue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const invoice = row.original as Invoice;
        return (
          <motion.div
            className="flex items-center gap-2 justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(invoice)}
              className="hover:bg-primary/10 dark:hover:bg-primary/20"
              title="View Details"
            >
              <Eye className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => downloadInvoice(invoice.id)}
              className="hover:bg-primary/10 dark:hover:bg-primary/20"
              title="Download PDF"
            >
              <Download className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(invoice)}
              className="hover:bg-destructive/10 dark:hover:bg-destructive/20"
              title="Delete Invoice"
            >
              <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80 transition-colors" />
            </Button>
          </motion.div>
        );
      },
    },
  ];

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewOpen(true);
  };

  const handleDelete = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedInvoice) {
      deleteInvoice.mutate(selectedInvoice.id);
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    }
  };

  return (
    <motion.div
      variants={containerAnimation}
      initial="hidden"
      animate="show"
      className="p-4 md:p-6 space-y-8 dark:bg-slate-900 min-h-screen"
    >
      <motion.div
        variants={itemAnimation}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20">
              <Receipt className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Invoices
            </h1>
          </div>
          <p className="text-muted-foreground dark:text-slate-400">
            Manage and track your business invoices
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => setOpen(true)}
            className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40 duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemAnimation}
        className="rounded-xl border dark:border-slate-800 shadow-lg dark:shadow-slate-900/50 overflow-hidden bg-white dark:bg-slate-900"
      >
        <DataTable
          columns={columns}
          data={invoices || []}
          isLoading={isLoading}
        />
      </motion.div>

      <AnimatePresence>
        {open && <InvoiceDialog open={open} onOpenChange={setOpen} />}
        {selectedInvoice && (
          <ViewInvoiceDialog
            open={isViewOpen}
            onOpenChange={setIsViewOpen}
            invoice={selectedInvoice}
          />
        )}
      </AnimatePresence>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="dark:bg-slate-900 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold dark:text-white">
              Delete Invoice
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-slate-400">
              This will permanently delete invoice #{selectedInvoice?.id} and
              all its data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="dark:bg-slate-800 dark:hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-red-900 dark:hover:bg-red-800"
            >
              Delete Invoice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

export default Invoices;
