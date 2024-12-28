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
      icon: <User2 className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      label: "Name",
      value: client.name,
      bgLight: "bg-blue-50",
      bgDark: "dark:bg-blue-950/40",
      borderLight: "border-blue-200",
      borderDark: "dark:border-blue-800",
      iconBg: "bg-blue-100/80 dark:bg-blue-900/40",
    },
    {
      icon: <Mail className="h-5 w-5 text-purple-500 dark:text-purple-400" />,
      label: "Email",
      value: client.email,
      bgLight: "bg-purple-50",
      bgDark: "dark:bg-purple-950/40",
      borderLight: "border-purple-200",
      borderDark: "dark:border-purple-800",
      iconBg: "bg-purple-100/80 dark:bg-purple-900/40",
    },
    {
      icon: (
        <Building2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
      ),
      label: "Company",
      value: client.company,
      bgLight: "bg-emerald-50",
      bgDark: "dark:bg-emerald-950/40",
      borderLight: "border-emerald-200",
      borderDark: "dark:border-emerald-800",
      iconBg: "bg-emerald-100/80 dark:bg-emerald-900/40",
    },
    {
      icon: <Calendar className="h-5 w-5 text-amber-500 dark:text-amber-400" />,
      label: "Created At",
      value: new Date(client.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      bgLight: "bg-amber-50",
      bgDark: "dark:bg-amber-950/40",
      borderLight: "border-amber-200",
      borderDark: "dark:border-amber-800",
      iconBg: "bg-amber-100/80 dark:bg-amber-900/40",
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
      <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900 dark:text-slate-50 font-semibold">
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
            <motion.div key={item.label} variants={item}>
              <Card
                className={`group p-4 border ${item.bgLight} ${item.bgDark} ${item.borderLight} ${item.borderDark} 
                hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-black/20 
                transition-all duration-300`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${item.iconBg} backdrop-blur-sm 
                  transition-transform duration-300 group-hover:scale-110`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {item.label}
                    </h3>
                    <p className="text-slate-900 dark:text-slate-50 font-semibold mt-1">
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
