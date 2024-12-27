import { motion } from 'framer-motion';
import { RevenueChart } from './components/revenue-chart';
import { ClientInsights } from './components/client-insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 4500, projected: 4000 },
  { month: 'Feb', revenue: 5200, projected: 4800 },
  { month: 'Mar', revenue: 6100, projected: 5500 },
  { month: 'Apr', revenue: 5900, projected: 6000 },
  { month: 'May', revenue: 7200, projected: 6500 },
];

const clientData = [
  { name: 'Enterprise', value: 35, color: 'hsl(var(--chart-1))' },
  { name: 'SMB', value: 45, color: 'hsl(var(--chart-2))' },
  { name: 'Startup', value: 20, color: 'hsl(var(--chart-3))' },
];

export function Analytics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">Track your business performance</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$28,900</p>
            <p className="text-sm text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">124</p>
            <p className="text-sm text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$2,450</p>
            <p className="text-sm text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart data={revenueData} />
        <ClientInsights data={clientData} />
      </div>
    </motion.div>
  );
}