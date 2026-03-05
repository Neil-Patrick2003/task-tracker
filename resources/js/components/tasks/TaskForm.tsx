// components/tasks/TaskForm.tsx
import { useForm } from '@inertiajs/react';
import type { FormEvent} from 'react';
import { useEffect } from 'react';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import type { TaskData, TaskFormData } from '@/components/tasks/type';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
    initialData?: TaskData | null;
    isEditing: boolean;
};

export default function TaskForm({
    open,
    onOpenChange,
    initialData,
    isEditing,
}: Props) {
    // Use TaskFormData instead of TaskData
    const { data, setData, post, put, processing, errors, reset } =
        useForm<TaskFormData>({
            date: new Date().toISOString().split('T')[0], // Default to today
            title: '',
            description: '',
            hoursRendered: 0,
            status: 'Ongoing',
            challengesEncountered: '',
            supportNeeded: false,
            supportSubject: '',
            supportDescription: '',
        });

    // Use useEffect to set form data when initialData changes (for editing)
    useEffect(() => {
        if (initialData && open) {
            setData({
                date: initialData.date,
                title: initialData.title,
                description: initialData.description,
                hoursRendered: initialData.hoursRendered,
                status: initialData.status,
                // Handle nested challenges object
                challengesEncountered:
                    initialData.challenges?.description || '',
                // Handle nested requests object for support
                supportNeeded: !!initialData.requests, // Convert to boolean
                supportSubject: initialData.requests?.subject || '',
                supportDescription: initialData.requests?.description || '',
            });
        }
    }, [initialData, open]); // Run when initialData or open changes

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (isEditing && initialData?.id) {
            put(`/trainee/tasks/${initialData.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post('/trainee/tasks', {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    const handleChange = (
        field: keyof TaskFormData,
        value: string | number | boolean,
    ) => {
        setData(field, value as never);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing
                                ? 'Edit Task Entry'
                                : 'Add New Task Entry'}
                        </DialogTitle>
                        <DialogDescription>
                            Record your daily Task. Fill in all the required
                            details.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4 py-4">
                        {/* Date Field */}
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={(e) =>
                                    handleChange('date', e.target.value)
                                }
                                required
                            />
                            {errors.date && (
                                <p className="text-sm text-red-500">
                                    {errors.date}
                                </p>
                            )}
                        </div>

                        {/* Hours Rendered Field */}
                        <div className="space-y-2">
                            <Label htmlFor="hoursRendered">
                                Hours Rendered
                            </Label>
                            <Input
                                id="hoursRendered"
                                type="number"
                                value={data.hoursRendered}
                                onChange={(e) =>
                                    handleChange(
                                        'hoursRendered',
                                        parseFloat(e.target.value) || 0,
                                    )
                                }
                                min="0"
                                step="0.5"
                                required
                            />
                            {errors.hoursRendered && (
                                <p className="text-sm text-red-500">
                                    {errors.hoursRendered}
                                </p>
                            )}
                        </div>

                        {/* Title Field */}
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    handleChange('title', e.target.value)
                                }
                                placeholder="Enter task title"
                                required
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Description Field */}
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2"
                                value={data.description}
                                onChange={(e) =>
                                    handleChange('description', e.target.value)
                                }
                                placeholder="Enter task description"
                                required
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Status Field */}
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                value={data.status}
                                onChange={(e) =>
                                    handleChange('status', e.target.value)
                                }
                            >
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                                <option value="Blocked">Blocked</option>
                            </select>
                        </div>

                        {/* Challenges Encountered Field */}
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="challengesEncountered">
                                Challenges Encountered
                            </Label>
                            <textarea
                                id="challengesEncountered"
                                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2"
                                value={data.challengesEncountered}
                                onChange={(e) =>
                                    handleChange(
                                        'challengesEncountered',
                                        e.target.value,
                                    )
                                }
                                placeholder="Describe any challenges faced"
                            />
                        </div>

                        {/* Support Needed Checkbox */}
                        <div className="col-span-2 space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="supportNeeded"
                                    checked={data.supportNeeded}
                                    onCheckedChange={(checked: boolean) =>
                                        handleChange('supportNeeded', checked)
                                    }
                                />
                                <Label htmlFor="supportNeeded">
                                    Support Needed
                                </Label>
                            </div>
                        </div>

                        {/* Support Fields - Conditional */}
                        {data.supportNeeded && (
                            <>
                                {/* Support Subject Field */}
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="supportSubject">
                                        Support Subject
                                    </Label>
                                    <Input
                                        id="supportSubject"
                                        type="text"
                                        value={data.supportSubject}
                                        onChange={(e) =>
                                            handleChange(
                                                'supportSubject',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter support subject"
                                        required={data.supportNeeded}
                                    />
                                    {errors.supportSubject && (
                                        <p className="text-sm text-red-500">
                                            {errors.supportSubject}
                                        </p>
                                    )}
                                </div>

                                {/* Support Description Field */}
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="supportDescription">
                                        Support Description
                                    </Label>
                                    <textarea
                                        id="supportDescription"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                                        value={data.supportDescription}
                                        onChange={(e) =>
                                            handleChange(
                                                'supportDescription',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Describe what support you need in detail"
                                        rows={3}
                                        required={data.supportNeeded}
                                    />
                                    {errors.supportDescription && (
                                        <p className="text-sm text-red-500">
                                            {errors.supportDescription}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                reset();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Saving...'
                                : isEditing
                                  ? 'Update Task'
                                  : 'Save Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
