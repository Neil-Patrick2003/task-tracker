import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';
import { Toaster } from '@/components/ui/toast';
import { FlashHandler } from '@/components/FlashHandler';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <Toaster />
        <FlashHandler />
        {children}
    </AppLayoutTemplate>
);
