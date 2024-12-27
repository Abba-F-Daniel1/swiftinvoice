import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, UserPlus, UserCog, User2, Mail, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import type { Client } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(2, "Company must be at least 2 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
  mode: "create" | "edit";
}

export function ClientDialog({
  open,
  onOpenChange,
  client,
  mode,
}: ClientDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
    },
  });

  useEffect(() => {
    if (client && mode === "edit") {
      form.reset({
        name: client.name,
        email: client.email,
        company: client.company,
      });
    } else if (!client && mode === "create") {
      form.reset({
        name: "",
        email: "",
        company: "",
      });
    }
  }, [client, mode, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      if (mode === "edit" && client) {
        return api.put(`/clients/${client.id}`, values);
      }
      return api.post("/clients", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      onOpenChange(false);
      form.reset();
      toast.success(
        mode === "edit"
          ? "Client updated successfully"
          : "Client added successfully"
      );
    },
    onError: () => {
      toast.error(
        mode === "edit" ? "Failed to update client" : "Failed to add client"
      );
    },
  });

  const formFields = [
    {
      name: "name" as const,
      label: "Name",
      icon: <User2 className="h-4 w-4" />,
      placeholder: "Enter client name",
      iconColor: mode === "edit" ? "text-blue-500" : "text-purple-500",
    },
    {
      name: "email" as const,
      label: "Email",
      icon: <Mail className="h-4 w-4" />,
      placeholder: "Enter client email",
      type: "email",
      iconColor: mode === "edit" ? "text-blue-500" : "text-purple-500",
    },
    {
      name: "company" as const,
      label: "Company",
      icon: <Building2 className="h-4 w-4" />,
      placeholder: "Enter company name",
      iconColor: mode === "edit" ? "text-blue-500" : "text-purple-500",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-lg backdrop-filter sm:max-w-md">
        <DialogHeader>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className={`p-2.5 rounded-xl ${
              mode === "edit" 
                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" 
                : "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
            }`}>
              {mode === "edit" ? (
                <UserCog className="h-6 w-6" />
              ) : (
                <UserPlus className="h-6 w-6" />
              )}
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {mode === "edit" ? "Edit Client" : "Add New Client"}
            </DialogTitle>
          </motion.div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutate(data))}
            className="space-y-6 mt-6"
          >
            <AnimatePresence>
              {formFields.map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FormField
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                          {field.label}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${field.iconColor}`}>
                              {field.icon}
                            </div>
                            <Input
                              {...formField}
                              type={field.type || "text"}
                              placeholder={field.placeholder}
                              className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 
                                text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400
                                focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
                                focus:border-transparent dark:focus:border-transparent
                                focus:ring-blue-500 dark:focus:ring-blue-400
                                transition-all duration-200"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400 text-sm" />
                      </FormItem>
                    )}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                type="submit"
                disabled={isPending}
                className={`w-full rounded-lg font-medium shadow-lg ${
                  mode === "edit"
                    ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                    : "bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700"
                } text-white transition-all duration-200 
                  focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
                  disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending
                  ? mode === "edit"
                    ? "Updating..."
                    : "Adding..."
                  : mode === "edit"
                  ? "Update Client"
                  : "Add Client"}
              </Button>
            </motion.div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}