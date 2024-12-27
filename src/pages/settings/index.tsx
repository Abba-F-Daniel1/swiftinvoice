import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanySettings } from "./components/company-settings";
import { InvoiceSettings } from "./components/invoice-settings";
import { NotificationSettings } from "./components/notification-settings";
import { TaxSettings } from "./components/tax-settings";
import { Settings2 } from "lucide-react";

export function Settings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 space-y-8 dark:bg-slate-900 min-h-screen"
    >
      <div className="mb-8">
        <div className="flex items-center gap-2"><Settings2 className="h-12 w-12 text-white p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20" />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          Settings
        </h1></div>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences
        </p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <CompanySettings />
        </TabsContent>
        <TabsContent value="invoice">
          <InvoiceSettings />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        <TabsContent value="tax">
          <TaxSettings />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
