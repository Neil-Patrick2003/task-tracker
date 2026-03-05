import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type UserRole = 'intern' | 'supervisor';

type RoleContextType = {
    role: UserRole;
    setRole: (role: UserRole) => void;
    toggleRole: () => void;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
    const [role, setRoleState] = useState<UserRole>(() => {
        if (typeof window === 'undefined') return 'intern';
        return (localStorage.getItem('userRole') as UserRole) || 'intern';
    });

    const setRole = useCallback((newRole: UserRole) => {
        setRoleState(newRole);
        localStorage.setItem('userRole', newRole);
    }, []);

    const toggleRole = useCallback(() => {
        const newRole = role === 'intern' ? 'supervisor' : 'intern';
        setRole(newRole);
    }, [role, setRole]);

    return (
        <RoleContext.Provider value={{ role, setRole, toggleRole }}>
            {children}
        </RoleContext.Provider>
    );
}

export function useRole() {
    const context = useContext(RoleContext);
    if (context === undefined) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
}
