export default function formatDate(
    date: Date | string | number | undefined,
    monthOpts: "2-digit" | "long" = "2-digit"
) {
    if (!date) return "";

    try {
        const formatted = new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: monthOpts,
            year: "numeric",
        }).format(new Date(date));

        if (monthOpts === "long") return formatted;

        const [day, month, year] = formatted.split("/");
        return `${year}-${month}-${day}`;
    } catch (_err) {
        return "";
    }
}
