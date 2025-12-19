import { z } from "zod";

// Canadian postal code pattern: A1A 1A1 or A1A1A1
const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/;

// MLS number pattern: typically 1-2 letters followed by 6-8 digits (e.g., C1234567, W12345678)
const mlsNumberRegex = /^[A-Za-z]{1,2}\d{6,8}$/;

export const propertyValidationSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  
  address: z
    .string()
    .min(5, "Street address is required (e.g., 123 Main St)")
    .max(200, "Address must be less than 200 characters"),
  
  city: z
    .string()
    .min(2, "City is required")
    .max(100, "City must be less than 100 characters"),
  
  province: z
    .string()
    .min(2, "Province is required")
    .max(50, "Province must be less than 50 characters"),
  
  postal_code: z
    .string()
    .regex(postalCodeRegex, "Enter a valid Canadian postal code (e.g., M5V 1A1)")
    .optional()
    .or(z.literal("")),
  
  price: z
    .string()
    .refine((val) => {
      if (!val || val === "") return true;
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Price must be a positive number"),
  
  mls_number: z
    .string()
    .refine((val) => {
      if (!val || val === "") return true;
      return mlsNumberRegex.test(val);
    }, "MLS format: 1-2 letters + 6-8 digits (e.g., C1234567)")
    .optional()
    .or(z.literal("")),
  
  bedrooms: z
    .string()
    .refine((val) => {
      if (!val || val === "") return true;
      const num = parseInt(val);
      return !isNaN(num) && num >= 0 && num <= 50;
    }, "Bedrooms must be 0-50")
    .optional(),
  
  bathrooms: z
    .string()
    .refine((val) => {
      if (!val || val === "") return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 30;
    }, "Bathrooms must be 0-30")
    .optional(),
  
  square_feet: z
    .string()
    .refine((val) => {
      if (!val || val === "") return true;
      const num = parseInt(val);
      return !isNaN(num) && num > 0 && num <= 100000;
    }, "Square feet must be 1-100,000")
    .optional(),
});

export type PropertyValidationData = z.infer<typeof propertyValidationSchema>;

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export const validateProperty = (data: Partial<PropertyValidationData>): ValidationErrors => {
  const result = propertyValidationSchema.safeParse(data);
  
  if (result.success) {
    return {};
  }
  
  const errors: ValidationErrors = {};
  result.error.errors.forEach((err) => {
    const path = err.path[0] as string;
    errors[path] = err.message;
  });
  
  return errors;
};

export const validateField = (field: string, value: string): string | undefined => {
  const schema = propertyValidationSchema.shape[field as keyof typeof propertyValidationSchema.shape];
  if (!schema) return undefined;
  
  const result = schema.safeParse(value);
  if (result.success) return undefined;
  
  return result.error.errors[0]?.message;
};