import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

const formSchema = z.object({
  description: z.string().min(3, 'Description must be at least 3 characters'),
  rate: z.coerce.number().min(0, 'Rate must be at least 0'),
});

type FormValues = z.infer<typeof formSchema>;

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceDialog({ open, onOpenChange }: ServiceDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      rate: 0,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: FormValues) => api.post('/services', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      onOpenChange(false);
      form.reset();
      toast.success('Service added successfully');
    },
    onError: () => {
      toast.error('Failed to add service');
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate (USD)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" step="0.01" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Adding...' : 'Add Service'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}