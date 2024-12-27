import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="invoice-paid">Invoice paid</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when an invoice is paid
              </p>
            </div>
            <Switch id="invoice-paid" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="invoice-overdue">Invoice overdue</Label>
              <p className="text-sm text-muted-foreground">
                Get alerted when invoices become overdue
              </p>
            </div>
            <Switch id="invoice-overdue" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="new-client">New client</Label>
              <p className="text-sm text-muted-foreground">
                Notification when a new client is added
              </p>
            </div>
            <Switch id="new-client" />
          </div>
        </div>

        <Button className="w-full">Save Preferences</Button>
      </CardContent>
    </Card>
  );
}