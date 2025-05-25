import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InputLabelProps = {
    id: string;
    type: string;

    labelText: string;
    placeholder: string;
    invalid?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputLabel({
    id,
    labelText,
    placeholder,
    type,
    invalid,
    ...props
}: InputLabelProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{labelText}</Label>
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                autoComplete="off"
                aria-invalid={invalid}
                {...props}
            />
        </div>
    );
}
