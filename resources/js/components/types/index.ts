    import type { InertiaLinkProps } from '@inertiajs/react';
    import type { LucideIcon } from 'lucide-react';
    import type { User } from '@/types';

    export interface SharedData {
        name: string;
        quote: { message: string; author: string };
        auth: Auth;
        sidebarOpen: boolean;
        [key: string]: unknown;
    }

    export interface Auth {
        user: User;
    }

    export interface BreadcrumbItem {
        title: string;
        href: string;
    }

    export interface NavGroup {
        title: string;
        items: NavItem[];
    }

    export interface NavItem {
        title: string;
        href: NonNullable<InertiaLinkProps['href']>;
        icon?: LucideIcon | null;
        isActive?: boolean;
    }


    export interface PaginatedData<T> {
        data: T[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLinks[];
        from: number;
        to: number;
    }
