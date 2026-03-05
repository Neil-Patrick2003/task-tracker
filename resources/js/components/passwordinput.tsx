import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

type Props = React.ComponentProps<"input"> & {
    toggleAriaLabel?: string;
};

const PasswordInput = React.forwardRef<HTMLInputElement, Props>(
    ({ className, toggleAriaLabel = 'Toggle password visibility', ...props }, ref) => {
        const [visible, setVisible] = React.useState(false);

        return (
            <div className="relative">
                <Input
                    ref={ref}
                    {...props}
                    type={visible ? 'text' : 'password'}
                    className={cn('pr-10', className)}
                />

                <button
                    type="button"
                    aria-label={toggleAriaLabel}
                    onClick={() => setVisible(v => !v)}
                    className="absolute inset-y-0 right-2 flex items-center rounded px-1 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                    {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
            </div>
        );
    },
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;