import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { RoleProvider } from '@/hooks/use-role';

type Props = {
    children: ReactNode;
    variant?: 'header' | 'sidebar';
};

export function AppShell({ children, variant = 'header' }: Props) {
    const isOpen = usePage().props.sidebarOpen;

    if (variant === 'header') {
        return (
            <RoleProvider>
                <div className="flex min-h-screen w-full flex-col">{children}</div>
            </RoleProvider>
        );
    }

    return (
        <RoleProvider>
            <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>
        </RoleProvider>
    );
}
