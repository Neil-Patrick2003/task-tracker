// components/supports/SupportForm.tsx
import { useForm } from '@inertiajs/react';
import { Send } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import type { SupportFormData } from '@/components/supports/type';
import type { Request } from '@/components/types/models/SupportRequest';
import type { Task } from '@/components/types/models/Task';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Request | null;
    isEditing: boolean;
    tasks?: Task[];
};

interface TaskOption {
    value: number;
    label: string;
}

export default function SupportForm({
    open,
    onOpenChange,
    initialData,
    isEditing,
    tasks = [],
}: Props) {
    const [selectedTask, setSelectedTask] = useState<TaskOption | null>(null);

    const { data, setData, post, put, processing, errors, reset } =
        useForm<SupportFormData>({
            subject: '',
            description: '',
            task_id: null,
        });

    useEffect(() => {
        if (initialData && open) {
            setData({
                subject: initialData.subject,
                description: initialData.description,
                task_id: initialData.task_id || null,
            });

            if (initialData.task_id && tasks.length > 0) {
                const task = tasks.find((t) => t.id === initialData.task_id);
                if (task) {
                    setSelectedTask({
                        value: task.id,
                        label: task.title,
                    });
                }
            }
        }
    }, [initialData, open, setData, tasks]);

    useEffect(() => {
        if (!open) {
            reset();
            setSelectedTask(null);
        }
    }, [open, reset]);

    const handleTaskChange = (option: TaskOption | null) => {
        setSelectedTask(option);
        setData('task_id', option?.value || null);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (isEditing && initialData?.id) {
            put(`/trainee/support-requests/${initialData.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    setSelectedTask(null);
                },
            });
        } else {
            post('/trainee/support-requests', {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    setSelectedTask(null);
                },
            });
        }
    };

    const taskOptions: TaskOption[] = tasks.map((task) => ({
        value: task.id,
        label: task.title,
    }));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing
                                ? 'Edit Support Request'
                                : 'New Support Request'}
                        </DialogTitle>
                        <DialogDescription>
                            Describe the issue you need help with. Your
                            supervisor will be notified.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                placeholder="Brief description of the issue"
                                value={data.subject}
                                onChange={(e) =>
                                    setData('subject', e.target.value)
                                }
                                required
                            />
                            {errors.subject && (
                                <p className="text-sm text-red-500">
                                    {errors.subject}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="task">Related Task</Label>
                            <Select
                                id="task"
                                options={taskOptions}
                                value={selectedTask}
                                onChange={handleTaskChange}
                                placeholder="Select a related task..."
                                isClearable
                                className="text-sm"
                            />
                            {errors.task_id && (
                                <p className="text-sm text-red-500">
                                    {errors.task_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Detailed Description
                            </Label>
                            <textarea
                                id="description"
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                placeholder="Explain your issue in detail. The more context you provide, the better help you'll receive."
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                required
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                reset();
                                setSelectedTask(null);
                            }}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Send className="mr-2 h-4 w-4" />
                            {processing
                                ? 'Saving...'
                                : isEditing
                                  ? 'Update Request'
                                  : 'Submit Request'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
