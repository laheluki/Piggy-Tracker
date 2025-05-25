import { FcDisclaimer, FcPlus } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import CreateTransaction from "@/components/transaction/create";

export default function ButtonCreateTransaction({
    type,
}: {
    type: "income" | "expense";
}) {
    const trigger =
        type === "income" ? (
            <Button className="gap-2 w-full sm:max-w-[200px]">
                <FcPlus />
                Pemasukan
            </Button>
        ) : (
            <Button className="gap-2 w-full sm:max-w-[200px]">
                <FcDisclaimer />
                Pengeluaran
            </Button>
        );

    return <CreateTransaction trigger={trigger} type={type} />;
}
