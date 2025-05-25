import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function ModalHeader({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <DialogHeader className="font-display">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
    );
}
