import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export function InvoiceSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoice Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-number">Auto-generate invoice numbers</Label>
            <Switch id="auto-number" />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="due-date">Default payment terms (days)</Label>
            <Input
              id="due-date"
              type="number"
              className="w-24"
              defaultValue={30}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="late-fee">Apply late payment fee</Label>
            <Switch id="late-fee" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Invoice Template</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 cursor-pointer hover:border-primary">
              <p className="font-medium">Modern</p>
            </div>
            <div className="border rounded-lg p-4 cursor-pointer hover:border-primary">
              <p className="font-medium">Classic</p>
            </div>
          </div>
        </div>

        <Button className="w-full">Save Preferences</Button>
      </CardContent>
    </Card>
  );
}