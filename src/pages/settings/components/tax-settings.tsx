import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Receipt } from 'lucide-react';

export function TaxSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Tax Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-tax">Enable Tax Calculation</Label>
            <Switch id="enable-tax" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tax-number">Tax Registration Number</Label>
              <Input id="tax-number" placeholder="Enter tax number" />
            </div>
            <div>
              <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                step="0.01"
                defaultValue="0.00"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="compound-tax">Enable Compound Tax</Label>
            <Switch id="compound-tax" />
          </div>
        </div>

        <Button className="w-full">Save Tax Settings</Button>
      </CardContent>
    </Card>
  );
}