import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    ClipboardList,
    HeadphonesIcon,
    Users,
    MessageSquareMore,
    ArrowLeftRight,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

// Navigation items for different roles
const navigationConfig = {
    intern: [
        {
            title: 'Dashboard',
            href: '/trainee/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'My Tasks',
            href: '/trainee/tasks',
            icon: ClipboardList,
        },
        {
            title: 'Support',
            href: '/trainee/support-requests',
            icon: HeadphonesIcon,
        },
    ],
    trainee: [
        // Alias for intern
        {
            title: 'Dashboard',
            href: '/trainee/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'My Tasks',
            href: '/trainee/tasks',
            icon: ClipboardList,
        },
        {
            title: 'Support',
            href: '/trainee/support-requests',
            icon: HeadphonesIcon,
        },
    ],
    supervisor: [
        {
            title: 'Dashboard',
            href: '/supervisor/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Task Monitoring',
            href: '/supervisor/tasks',
            icon: ClipboardList,
        },
        {
            title: 'Support Requests',
            href: '/supervisor/support-requests',
            icon: MessageSquareMore,
        },
        {
            title: 'Interns',
            href: '/supervisor/interns',
            icon: Users,
        },
    ],
};

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.role?.toLowerCase() || '';

    // Get nav items for the user's role, fallback to empty array
    const navItems =
        navigationConfig[userRole as keyof typeof navigationConfig] || [];

    // Determine home href based on role
    const getHomeHref = () => {
        switch (userRole) {
            case 'intern':
            case 'trainee':
                return '/trainee/dashboard';
            case 'supervisor':
                return '/supervisor/dashboard';
            default:
                return '/';
        }
    };

    // Get display label based on role
    const getMenuLabel = () => {
        switch (userRole) {
            case 'intern':
            case 'trainee':
                return 'Intern Menu';
            case 'supervisor':
                return 'Supervisor Menu';
            default:
                return 'Menu';
        }
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={getHomeHref()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {navItems.length > 0 ? (
                    <NavMain items={navItems} label={getMenuLabel()} />
                ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                        No navigation items available
                    </div>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
