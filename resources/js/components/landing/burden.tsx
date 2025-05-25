import { type PillVariant, BurdenPill } from "@/components/landing/burden-pill";

const datas = [
    {
        emoji: "🍜",
        name: "Mie Ayam",
    },
    {
        emoji: "☕",
        name: "Ngopi",
    },
    {
        emoji: "💡",
        name: "Bayar Listrik",
    },
    {
        emoji: "📱",
        name: "Paket Data",
    },
    {
        emoji: "🎮",
        name: "Top Up Game",
    },
    {
        emoji: "🛵",
        name: "Isi Bensin",
    },
    {
        emoji: "🛒",
        name: "Belanja Shopee",
    },
    {
        emoji: "🙀",
        name: "Makanan Si Oyen",
    },
];

const variants: NonNullable<PillVariant>[] = [
    "seblak",
    "kopi",
    "listrik",
    "data",
    "game",
    "bensin",
    "shopee",
    "oyen",
];

export default function Burden() {
    return (
        <ul className="flex flex-col gap-8 px-[5%] lg:px-0">
            {datas.map(({ emoji, name }, index) => (
                <li key={name} className="flex justify-center">
                    <BurdenPill
                        name={name}
                        emoji={emoji}
                        tilt={index % 2 === 0 ? -1 : 1}
                        variant={variants[index % variants.length]}
                    />
                </li>
            ))}
        </ul>
    );
}
