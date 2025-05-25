import * as ReactDOM from "react-dom";

import { AnimatePresence, motion } from "framer-motion";
import { Table } from "@tanstack/react-table";

interface ActionBarProps<TData>
    extends React.ComponentProps<typeof motion.div> {
    visible?: boolean;
    table: Table<TData>;
}

export default function ActionBar<TData>({
    table,
    visible: visibleProp,
    children,
}: ActionBarProps<TData>) {
    const visible =
        visibleProp ?? table.getFilteredSelectedRowModel().rows.length > 0;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {visible && (
                <motion.div
                    role="toolbar"
                    aria-orientation="horizontal"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="fixed inset-x-0 bottom-6 z-50 mx-auto flex w-fit flex-wrap items-center justify-center gap-2 rounded-md border bg-background p-2 text-foreground shadow-sm"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>,
        document.getElementById("root") as HTMLElement
    );
}
