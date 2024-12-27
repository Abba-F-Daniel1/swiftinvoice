import { motion } from "framer-motion";
import { Calendar, Mail, Building2, User2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import type { Client } from "@/types";

interface ViewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

export function ViewClientDialog({
  open,
  onOpenChange,
  client,
}: ViewClientDialogProps) {
  if (!client) return null;

  const infoItems = [
    {
      icon: <User2 className="h-5 w-5 text-blue-400" />,
      label: "Name",
      value: client.name,
      gradient: "from-blue-950 to-blue-900",
    },
    {
      icon: <Mail className="h-5 w-5 text-teal-400" />,
      label: "Email",
      value: client.email,
      gradient: "from-teal-950 to-teal-900",
    },
    {
      icon: <Building2 className="h-5 w-5 text-violet-400" />,
      label: "Company",
      value: client.company,
      gradient: "from-violet-950 to-violet-900",
    },
    {
      icon: <Calendar className="h-5 w-5 text-rose-400" />,
      label: "Created At",
      value: new Date(client.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      gradient: "from-rose-950 to-rose-900",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-950 border-slate-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-50 font-semibold">
            Client Details
          </DialogTitle>
        </DialogHeader>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-6 space-y-4"
        >
          {infoItems.map((item) => (
            <motion.div key={item.label} variants={item} className="group">
              <Card
                className={`p-4 bg-gradient-to-br ${item.gradient} border-slate-800 hover:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black/40 rounded-xl backdrop-blur-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-300">
                      {item.label}
                    </h3>
                    <p className="text-slate-50 font-semibold mt-1">
                      {item.value}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
