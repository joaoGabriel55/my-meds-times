import i18n from "@/lib/i18n";
import { toDate } from "date-fns";
import { format } from "date-fns/format";

export function formatDateTime(date: string | Date): string {
  if (i18n.language === "en") return format(date, "yyyy-MM-dd HH:mm");
  else return format(date, "dd/MM/yyyy HH:mm");
}

export function formatDateHour(date: string | Date): string {
  return format(date, "HH:mm");
}

export function parseDateToISO(dateString: string | Date): string {
  return toDate(dateString).toISOString();
}
