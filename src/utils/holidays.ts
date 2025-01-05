export const holidays = [
  // 2024 Holidays
  { date: '2024-01-01', name: "New Year's Day" },
  { date: '2024-01-15', name: "Martin Luther King Jr. Day" },
  { date: '2024-02-14', name: "Valentine's Day" },
  { date: '2024-02-19', name: "Presidents' Day" },
  { date: '2024-03-31', name: "Easter" },
  { date: '2024-05-27', name: "Memorial Day" },
  { date: '2024-06-19', name: "Juneteenth" },
  { date: '2024-07-04', name: "Independence Day" },
  { date: '2024-09-02', name: "Labor Day" },
  { date: '2024-10-31', name: "Halloween" },
  { date: '2024-11-28', name: "Thanksgiving" },
  { date: '2024-12-25', name: "Christmas" },
  
  // 2025 Holidays
  { date: '2025-01-01', name: "New Year's Day" },
  { date: '2025-01-20', name: "Martin Luther King Jr. Day" },
  { date: '2025-02-14', name: "Valentine's Day" },
  { date: '2025-02-17', name: "Presidents' Day" },
  { date: '2025-04-20', name: "Easter" },
  { date: '2025-05-26', name: "Memorial Day" },
  { date: '2025-06-19', name: "Juneteenth" },
  { date: '2025-07-04', name: "Independence Day" },
  { date: '2025-09-01', name: "Labor Day" },
  { date: '2025-10-31', name: "Halloween" },
  { date: '2025-11-27', name: "Thanksgiving" },
  { date: '2025-12-25', name: "Christmas" }
]

export function getHolidaysForMonth(year: number, month: number): typeof holidays {
  return holidays.filter(holiday => {
    const holidayDate = new Date(holiday.date)
    return holidayDate.getFullYear() === year && holidayDate.getMonth() === month
  })
} 