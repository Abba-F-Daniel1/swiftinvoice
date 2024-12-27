import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Building2,
  Search,
  Filter,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ClientDialog } from "./client-dialog";
import { ViewClientDialog } from "./view-client-dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios";
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
import { Card } from "@/components/ui/card";
import type { Client } from "@/types";

export function Clients() {
  const [isOpen, setIsOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await api.get<Client[]>("/clients");
      return response.data;
    },
  });

  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/clients/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client deleted successfully");
      setIsDeleteOpen(false);
      setSelectedClient(null);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || "Failed to delete client";
      toast.error(errorMessage);
      setIsDeleteOpen(false);
    },
  });

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-sm font-semibold text-white">
              {row.original.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="font-medium text-gray-800">{row.original.name}</div>
        </motion.div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-gray-600 font-medium">{row.original.email}</div>
      ),
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50">
            <Building2 className="h-4 w-4 text-blue-500" />
          </div>
          <span className="text-gray-600">{row.original.company}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(client)}
              className="hover:bg-blue-50 group"
            >
              <Eye className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(client)}
              className="hover:bg-blue-50 group"
            >
              <Pencil className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(client)}
              className="hover:bg-blue-50 group"
            >
              <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleView = (client: Client) => {
    setSelectedClient(client);
    setIsViewOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsOpen(true);
  };

  const handleDelete = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedClient) {
      deleteClient.mutate(selectedClient.id);
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setSelectedClient(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen dark:bg-slate-900 p-4 sm:p-6 md:p-8"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center align-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Clients</h1>
              </div>
              <Button
                onClick={() => {
                  setSelectedClient(null);
                  setIsOpen(true);
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Client
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search clients..."
                  className="pl-10 bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 w-full focus:border-blue-500/50 focus:ring-blue-500/20"
                />
              </div>
              <Button
                variant="outline"
                className="text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 group"
              >
                <Filter className="mr-2 h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                Filters
              </Button>
            </div>
          </motion.div>

          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
            <div className="overflow-hidden rounded-xl">
              <DataTable
                columns={columns}
                data={clients || []}
                isLoading={isLoading}
              />
            </div>
          </Card>
        </div>

        <ClientDialog
          open={isOpen}
          onOpenChange={handleDialogClose}
          client={selectedClient}
          mode={selectedClient ? "edit" : "create"}
        />

        <ViewClientDialog
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          client={selectedClient}
        />

        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent className="bg-white border-gray-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-800">
                Delete Client
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Are you sure you want to delete {selectedClient?.name}'s record
                {selectedClient?.company && ` from ${selectedClient.company}`}?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-100"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </AnimatePresence>
  );
}
