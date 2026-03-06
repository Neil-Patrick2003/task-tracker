import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function FlashHandler() {
    const { props } = usePage() as any;
    const flash = props.flash || {};
    const shownMessages = useRef<Set<string>>(new Set());

    useEffect(() => {
        // Create a unique key for this flash message
        const flashKey = JSON.stringify(flash);

        // Skip if we've already shown this exact message
        if (shownMessages.current.has(flashKey)) {
            return;
        }

        // Mark this message as shown
        if (flash.success || flash.error || flash.warning || flash.info) {
            shownMessages.current.add(flashKey);

            // Clear old messages from the set to prevent memory leak
            if (shownMessages.current.size > 10) {
                const values = Array.from(shownMessages.current);
                shownMessages.current = new Set(values.slice(-10));
            }
        }

        if (flash.success) {
            console.log('FlashHandler: Showing success toast:', flash.success);
            toast.success(flash.success);
        }
        if (flash.error) {
            console.log('FlashHandler: Showing error toast:', flash.error);
            toast.error(flash.error);
        }
        if (flash.warning) {
            console.log('FlashHandler: Showing warning toast:', flash.warning);
            toast.warning(flash.warning);
        }
        if (flash.info) {
            console.log('FlashHandler: Showing info toast:', flash.info);
            toast.info(flash.info);
        }
    }, [flash.success, flash.error, flash.warning, flash.info]);

    return null;
}
