export type DataTypes = {
    id: string;
    category: {
        id: string;
        name: string;
        emoji: string;
        type?: "income" | "expense";
    };
    description: string;
    amount: number;
    date: string;
};
