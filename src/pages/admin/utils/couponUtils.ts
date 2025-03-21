
import { addDays, addWeeks, addMonths } from "date-fns";
import { ExpiryType, DurationType } from "../types/coupons";

/**
 * Calculate the expiry date based on the expiry type and duration settings
 */
export const calculateExpiryDate = (
  expiryType: ExpiryType,
  fixedDate: string,
  durationValue: number,
  durationType: DurationType
): string | null => {
  if (expiryType === "fixed") {
    return fixedDate ? new Date(fixedDate).toISOString() : null;
  } else {
    const now = new Date();
    let expiryDate: Date;
    
    switch (durationType) {
      case "days":
        expiryDate = addDays(now, durationValue);
        break;
      case "weeks":
        expiryDate = addWeeks(now, durationValue);
        break;
      case "months":
        expiryDate = addMonths(now, durationValue);
        break;
      default:
        expiryDate = addDays(now, durationValue);
    }
    
    return expiryDate.toISOString();
  }
};
