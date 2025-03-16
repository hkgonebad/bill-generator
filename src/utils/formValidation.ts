import { useState } from "react";

type ValidationRule<T> = (value: any, formData: T) => string | null;

export interface ValidationRules<T> {
  [key: string]: ValidationRule<T>[];
}

export interface UseFormValidationProps<T> {
  initialValues: T;
  validationRules: ValidationRules<T>;
}

export interface UseFormValidationReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (field: keyof T, value: any) => void;
  handleBlur: (field: keyof T) => void;
  validateForm: () => boolean;
  setFieldValue: (field: keyof T, value: any) => void;
  resetForm: () => void;
}

export function useFormValidation<T>({ initialValues, validationRules }: UseFormValidationProps<T>): UseFormValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: keyof T): string => {
    if (!validationRules[field as string]) return "";

    const fieldRules = validationRules[field as string];
    for (const rule of fieldRules) {
      const error = rule(values[field], values);
      if (error) return error;
    }

    return "";
  };

  const handleChange = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    // Validate field if it's been touched
    if (touched[field as string]) {
      const error = validateField(field);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const error = validateField(field);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate all fields
    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field as keyof T);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(validationRules).forEach((field) => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    return isValid;
  };

  const setFieldValue = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    setFieldValue,
    resetForm,
  };
}

// Common validation rules
export const required = (fieldName: string) => (value: any) => {
  if (value === undefined || value === null || value === "") {
    return `${fieldName} is required`;
  }
  return null;
};

export const minValue = (min: number, fieldName: string) => (value: any) => {
  if (value < min) {
    return `${fieldName} must be at least ${min}`;
  }
  return null;
};

export const maxValue = (max: number, fieldName: string) => (value: any) => {
  if (value > max) {
    return `${fieldName} must be at most ${max}`;
  }
  return null;
};

export const isEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return "Invalid email address";
  }
  return null;
};

export const isPhone = (value: string) => {
  const phoneRegex = /^\d{10,15}$/;
  if (!phoneRegex.test(value.replace(/\D/g, ""))) {
    return "Invalid phone number";
  }
  return null;
};

export const dateAfter = (dateField: string, fieldName: string) => (value: string, formData: any) => {
  const date1 = new Date(value);
  const date2 = new Date(formData[dateField]);

  if (date1 < date2) {
    return `${fieldName} cannot be before ${dateField}`;
  }
  return null;
};

export const dateBefore = (dateField: string, fieldName: string) => (value: string, formData: any) => {
  const date1 = new Date(value);
  const date2 = new Date(formData[dateField]);

  if (date1 > date2) {
    return `${fieldName} cannot be after ${dateField}`;
  }
  return null;
};
