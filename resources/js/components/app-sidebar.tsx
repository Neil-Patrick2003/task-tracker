import { Link } from '@inertiajs/react';
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
import { useRole } from '@/hooks/use-role';

import type { NavItem } from '@/types';

// Trainee/Intern navigation items
const traineeNavItems: NavItem[] = [
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
];

// Supervisor navigation items
const supervisorNavItems: NavItem[] = [
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
        href: '/supervisor/support',
        icon: MessageSquareMore,
    },
    {
        title: 'Interns',
        href: '/supervisor/interns',
        icon: Users,
    },
];

export function AppSidebar() {
    const { role, toggleRole } = useRole();
    const isIntern = role === 'intern';
    const navItems = isIntern ? traineeNavItems : supervisorNavItems;
    const homeHref = isIntern ? '/trainee/dashboard' : '/supervisor/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} label={isIntern ? 'Intern' : 'Supervisor'} />

                {/* Role Switcher for Demo */}
                <div className="px-3 py-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={toggleRole}
                    >
                        <ArrowLeftRight className="h-4 w-4" />
                        <span className="text-xs">Switch to {isIntern ? 'Supervisor' : 'Intern'}</span>
                    </Button>
                </div>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
