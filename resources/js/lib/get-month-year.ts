export default function getMonthYear(): { month: string; year: number } {
    const date = new Date();
    const monthIndex = date.getMonth(); // 0 = January, 11 = December

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const currentMonth = monthNames[monthIndex];
    const currentYear = date.getFullYear();
    return { month: currentMonth, year: currentYear };
}
