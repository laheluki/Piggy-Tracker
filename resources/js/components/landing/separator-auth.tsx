import { Separator } from "@/components/ui/separator";

export default function SeparatorAuth({ text }: { text: string }) {
    return (
        <div className="flex flex-row items-center justify-center my-4 gap-3">
            <Separator />
            <p className="text-center text-sm text-muted-foreground">{text}</p>
            <Separator />
        </div>
    );
}
