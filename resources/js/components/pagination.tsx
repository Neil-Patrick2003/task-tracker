import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    links: PaginationLink[];
    current_page: number;
    last_page: number;
};

export default function PaginationPrevNext({
    links,
    current_page,
    last_page,
}: Props) {
    if (!links?.length) return null;

    const prev = links[0];
    const next = links[links.length - 1];

    const prevDisabled = !prev?.url;
    const nextDisabled = !next?.url;

    return (
        <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
                Page {current_page} of {last_page}
            </div>

            <div className="flex items-center gap-2">
                {prev?.url ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link
                            href={prev.url}
                            preserveState
                            preserveScroll
                            replace
                            className="inline-flex items-center gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Link>
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="inline-flex items-center gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                )}

                {next?.url ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link
                            href={next.url}
                            preserveState
                            preserveScroll
                            replace
                            className="inline-flex items-center gap-2"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="inline-flex items-center gap-2"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
