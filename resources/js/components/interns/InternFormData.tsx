import { useForm } from '@inertiajs/react';
import { User, Mail, Save, X, Trash2, AlertTriangle, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Intern {
    id: number;
    name: string;
    email: string;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Intern | null;
    isEditing: boolean;
}

export default function InternFormData({
                                           open,
                                           onOpenChange,
                                           initialData,
                                           isEditing,
                                       }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Initialize form data when editing
    useEffect(() => {
        if (initialData && open) {
            setData({
                name: initialData.name || '',
                email: initialData.email || '',
                password: '',
                password_confirmation: '',
            });
            setShowPasswordFields(false);
        }
    }, [initialData, open, setData]);

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            reset();
            setShowPassword(false);
            setShowPasswordFields(false);
        }
    }, [open, reset]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // For edit mode, only include password if showPasswordFields is true
        const submitData = {
            name: data.name,
            email: data.email,
            ...(isEditing && showPasswordFields && data.password ? {
                password: data.password,
                password_confirmation: data.password_confirmation,
            } : {}),
        };

        if (isEditing && initialData?.id) {
            put(`/supervisor/interns/${initialData.id}`, {
                data: submitData,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    setShowPasswordFields(false);
                },
            });
        } else {
            post('/supervisor/interns', {
                data: submitData,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (initialData?.id) {
            destroy(`/supervisor/interns/${initialData.id}`, {
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    return (
        <>
            {/* Main Form Dialog */}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                {isEditing ? 'Edit Intern' : 'Add New Intern'}
                            </DialogTitle>
                            <DialogDescription>
                                {isEditing
                                    ? 'Update intern information.'
                                    : 'Fill in the details to add a new intern.'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="flex items-center gap-2"
                                >
                                    <User className="h-4 w-4" />
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="flex items-center gap-2"
                                >
                                    <Mail className="h-4 w-4" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {!isEditing ? (
                                // Create mode - password fields required
                                <>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="password"
                                            className="flex items-center gap-2"
                                        >
                                            <Lock className="h-4 w-4" />
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder="Enter password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm text-red-500">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="password_confirmation"
                                            className="flex items-center gap-2"
                                        >
                                            <Lock className="h-4 w-4" />
                                            Confirm Password
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            placeholder="Confirm password"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                </>
                            ) : (
                                // Edit mode - optional password change
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="changePassword"
                                            checked={showPasswordFields}
                                            onCheckedChange={(checked) =>
                                                setShowPasswordFields(checked as boolean)
                                            }
                                        />
                                        <Label
                                            htmlFor="changePassword"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Change Password
                                        </Label>
                                    </div>

                                    {showPasswordFields && (
                                        <>
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="password"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Lock className="h-4 w-4" />
                                                    New Password
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={
                                                            showPassword
                                                                ? 'text'
                                                                : 'password'
                                                        }
                                                        placeholder="Enter new password"
                                                        value={data.password}
                                                        onChange={(e) =>
                                                            setData(
                                                                'password',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword,
                                                            )
                                                        }
                                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
                                                    >
                                                        {showPassword ? 'Hide' : 'Show'}
                                                    </button>
                                                </div>
                                                {errors.password && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.password}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="password_confirmation"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Lock className="h-4 w-4" />
                                                    Confirm New Password
                                                </Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    placeholder="Confirm new password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) =>
                                                        setData(
                                                            'password_confirmation',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            {isEditing && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => setShowDeleteDialog(true)}
                                    disabled={processing}
                                    className="mr-auto"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            )}
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        onOpenChange(false);
                                        reset();
                                        setShowPasswordFields(false);
                                    }}
                                    disabled={processing}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing
                                        ? 'Saving...'
                                        : isEditing
                                            ? 'Update'
                                            : 'Save'}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Delete Intern Account
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {initialData?.name}
                            's account? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="mb-2 text-sm font-medium">
                            This will permanently delete:
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                            <li>Personal information</li>
                            <li>All task entries</li>
                            <li>Support requests</li>
                            <li>Progress records</li>
                        </ul>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={processing}
                        >
                            {processing ? 'Deleting...' : 'Yes, Delete Account'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
