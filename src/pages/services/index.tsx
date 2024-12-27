import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Tags, BriefcaseBusiness } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ServiceDialog } from "./components/service-dialog";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: number;
  name: string;
  description: string;
  rate: number;
  category: string;
}

export function Services() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await api.get<Service[]>("/services");
      return response.data;
    },
  });

  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "rate",
      header: "Rate",
      cell: ({ row }) => formatCurrency(row.original.rate),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="secondary">
          <Tags className="mr-1 h-3 w-3" />
          {row.original.category}
        </Badge>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 space-y-8 dark:bg-slate-900 min-h-screen"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20">
              <BriefcaseBusiness className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Services
            </h1>
          </div>
          <p className="text-muted-foreground dark:text-slate-400">
            Manage your service catalog
          </p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40 duration-300"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={services || []}
        isLoading={isLoading}
      />
      <ServiceDialog open={isOpen} onOpenChange={setIsOpen} />
    </motion.div>
  );
}
