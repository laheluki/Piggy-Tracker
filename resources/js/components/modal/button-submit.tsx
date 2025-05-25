import { Button } from "@/components/ui/button";

interface ButtonSubmitProps {
    isValid: boolean;
    isSubmitting: boolean;
    text: string;
}

export default function ButtonSubmit({
    isSubmitting,
    isValid,
    text,
}: ButtonSubmitProps) {
    return (
        <Button
            type="submit"
            variant={isValid ? "default" : "ghost"}
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            disabled={!isValid || isSubmitting}
        >
            {isSubmitting && (
                <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx={12} cy={12} r={10} />
                    <path d="M12 2v10l4 4" />
                </svg>
            )}
            {!isSubmitting && <span>{text}</span>}
        </Button>
    );
}
