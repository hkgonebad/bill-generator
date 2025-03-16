"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Defining state types
export interface FieldError {
  [key: string]: string;
}

export interface BillState {
  billData: Record<string, any>;
  selectedTemplate: string | number;
  loading: boolean;
  error: string;
  success: string;
  savingToAccount: boolean;
  billName: string;
  fieldErrors: FieldError;
  touched: Record<string, boolean>;
  validated: boolean;
}

// Action types
export enum BillActionType {
  SET_BILL_DATA = "SET_BILL_DATA",
  UPDATE_BILL_DATA = "UPDATE_BILL_DATA",
  SET_TEMPLATE = "SET_TEMPLATE",
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_SUCCESS = "SET_SUCCESS",
  SET_SAVING_TO_ACCOUNT = "SET_SAVING_TO_ACCOUNT",
  SET_BILL_NAME = "SET_BILL_NAME",
  SET_FIELD_ERROR = "SET_FIELD_ERROR",
  VALIDATE_FORM = "VALIDATE_FORM",
  RESET_ERRORS = "RESET_ERRORS",
  TOUCH_FIELD = "TOUCH_FIELD",
  RESET_STATE = "RESET_STATE",
}

// Action interface
interface BillAction {
  type: BillActionType;
  payload?: any;
}

// Context interface
interface BillContextType {
  state: BillState;
  dispatch: React.Dispatch<BillAction>;
  handleDataChange: (data: Record<string, any>) => void;
  handleBlur: (field: string, value: any) => void;
  validateField: (field: string, value: any) => boolean;
  validateForm: () => boolean;
  saveBill: () => Promise<void>;
  generatePDF: () => Promise<void>;
  fetchBill: (id: string) => Promise<void>;
}

// Initial state
const initialState: BillState = {
  billData: {},
  selectedTemplate: 1,
  loading: false,
  error: "",
  success: "",
  savingToAccount: false,
  billName: "",
  fieldErrors: {},
  touched: {},
  validated: false,
};

// Reducer function
const billReducer = (state: BillState, action: BillAction): BillState => {
  switch (action.type) {
    case BillActionType.SET_BILL_DATA:
      return {
        ...state,
        billData: action.payload,
      };
    case BillActionType.UPDATE_BILL_DATA:
      return {
        ...state,
        billData: {
          ...state.billData,
          ...action.payload,
        },
      };
    case BillActionType.SET_TEMPLATE:
      return {
        ...state,
        selectedTemplate: action.payload,
      };
    case BillActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case BillActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case BillActionType.SET_SUCCESS:
      return {
        ...state,
        success: action.payload,
      };
    case BillActionType.SET_SAVING_TO_ACCOUNT:
      return {
        ...state,
        savingToAccount: action.payload,
      };
    case BillActionType.SET_BILL_NAME:
      return {
        ...state,
        billName: action.payload,
      };
    case BillActionType.SET_FIELD_ERROR:
      return {
        ...state,
        fieldErrors: {
          ...state.fieldErrors,
          [action.payload.field]: action.payload.error,
        },
      };
    case BillActionType.VALIDATE_FORM:
      return {
        ...state,
        validated: true,
      };
    case BillActionType.RESET_ERRORS:
      return {
        ...state,
        fieldErrors: {},
        error: "",
      };
    case BillActionType.TOUCH_FIELD:
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.payload]: true,
        },
      };
    case BillActionType.RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

// Create context
const BillContext = createContext<BillContextType | undefined>(undefined);

// Bill provider props
interface BillProviderProps {
  children: ReactNode;
  initialData?: Partial<BillState>;
  billType: "rent" | "fuel";
  validationRules: Record<string, (value: any, data: any) => string | null>;
  requiredFields: string[];
}

// Provider component
export const BillProvider: React.FC<BillProviderProps> = ({ children, initialData, billType, validationRules, requiredFields }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Merge initial state with provided data
  const mergedInitialState = {
    ...initialState,
    ...initialData,
  };

  const [state, dispatch] = useReducer(billReducer, mergedInitialState);

  // Handle data change
  const handleDataChange = (data: Record<string, any>) => {
    dispatch({
      type: BillActionType.UPDATE_BILL_DATA,
      payload: data,
    });
  };

  // Validate field
  const validateField = (field: string, value: any): boolean => {
    // If field has a validation rule, apply it
    if (validationRules[field]) {
      const error = validationRules[field](value, state.billData);

      dispatch({
        type: BillActionType.SET_FIELD_ERROR,
        payload: { field, error: error || "" },
      });

      return !error;
    }

    // If no validation rule but field is required, check if empty
    if (requiredFields.includes(field)) {
      const isEmpty = value === undefined || value === null || value === "";
      const error = isEmpty ? `${field} is required` : "";

      dispatch({
        type: BillActionType.SET_FIELD_ERROR,
        payload: { field, error },
      });

      return !error;
    }

    return true;
  };

  // Handle blur
  const handleBlur = (field: string, value: any) => {
    dispatch({
      type: BillActionType.TOUCH_FIELD,
      payload: field,
    });

    validateField(field, value);
  };

  // Validate form
  const validateForm = (): boolean => {
    dispatch({ type: BillActionType.VALIDATE_FORM });

    let isValid = true;

    // Validate all required fields
    requiredFields.forEach((field) => {
      let value: any;

      // Handle nested fields
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        value = state.billData[parent]?.[child];
      } else {
        value = state.billData[field];
      }

      if (!validateField(field, value)) {
        isValid = false;
      }
    });

    if (!isValid) {
      dispatch({
        type: BillActionType.SET_ERROR,
        payload: "Please fill in all required fields",
      });
    }

    return isValid;
  };

  // Save bill
  const saveBill = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    if (status !== "authenticated") {
      dispatch({
        type: BillActionType.SET_ERROR,
        payload: "You must be logged in to save bills to your account",
      });
      return;
    }

    try {
      dispatch({ type: BillActionType.SET_LOADING, payload: true });
      dispatch({ type: BillActionType.SET_SAVING_TO_ACCOUNT, payload: true });

      // Prepare bill data
      const billData = {
        ...state.billData,
        name: state.billName || `${billType.charAt(0).toUpperCase() + billType.slice(1)} - ${new Date().toISOString().split("T")[0]}`,
      };

      // Determine if editing or creating
      const editMode = state.billData.id;
      const url = editMode ? `/api/bills/${editMode}` : "/api/bills";
      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billType,
          ...billData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save bill");
      }

      dispatch({
        type: BillActionType.SET_SUCCESS,
        payload: editMode ? "Bill updated successfully!" : "Bill saved to your account successfully!",
      });

      if (!editMode) {
        // Redirect to dashboard after creating new bill
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      dispatch({
        type: BillActionType.SET_ERROR,
        payload: (error as Error).message || "Failed to save bill to your account",
      });
    } finally {
      dispatch({ type: BillActionType.SET_LOADING, payload: false });
    }
  };

  // This is just a placeholder - the actual implementation would need to be done within the components
  // that use this context, as it involves DOM manipulation and specific bill types
  const generatePDF = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    dispatch({
      type: BillActionType.SET_ERROR,
      payload: "Use the actual PDF generation function from the component",
    });

    return Promise.resolve();
  };

  // Fetch bill
  const fetchBill = async (id: string): Promise<void> => {
    try {
      dispatch({ type: BillActionType.SET_LOADING, payload: true });

      const response = await fetch(`/api/bills/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bill");
      }

      dispatch({ type: BillActionType.SET_BILL_DATA, payload: data.bill });
      dispatch({ type: BillActionType.SET_BILL_NAME, payload: data.bill.name || "" });
      dispatch({ type: BillActionType.SET_SAVING_TO_ACCOUNT, payload: true });
      dispatch({ type: BillActionType.SET_TEMPLATE, payload: data.bill.templateId || 1 });
    } catch (error) {
      dispatch({
        type: BillActionType.SET_ERROR,
        payload: "Failed to load the bill for editing",
      });
    } finally {
      dispatch({ type: BillActionType.SET_LOADING, payload: false });
    }
  };

  return (
    <BillContext.Provider
      value={{
        state,
        dispatch,
        handleDataChange,
        handleBlur,
        validateField,
        validateForm,
        saveBill,
        generatePDF,
        fetchBill,
      }}
    >
      {children}
    </BillContext.Provider>
  );
};

// Hook to use bill context
export const useBillContext = (): BillContextType => {
  const context = useContext(BillContext);

  if (!context) {
    throw new Error("useBillContext must be used within a BillProvider");
  }

  return context;
};

// Example of how to use this context (commented out for reference)
/*
// In a component file:
import { BillProvider, useBillContext } from '@/contexts/BillContext';

// Validation rules
const rentValidationRules = {
  'landlordName': (value: any) => !value ? 'Landlord name is required' : null,
  'tenantName': (value: any) => !value ? 'Tenant name is required' : null,
  'rentAmount': (value: any) => {
    if (!value) return 'Rent amount is required';
    if (value <= 0) return 'Rent amount must be greater than 0';
    return null;
  },
  // ... other validation rules
};

// Required fields
const requiredFields = [
  'landlordName', 
  'tenantName', 
  'tenantAddress',
  'rentAmount',
  'paymentDate',
  'rentPeriod.from',
  'rentPeriod.to'
];

// In your page component
const RentReceiptPage = () => {
  return (
    <BillProvider 
      billType="rent"
      validationRules={rentValidationRules}
      requiredFields={requiredFields}
    >
      <RentReceiptContent />
    </BillProvider>
  );
};

// Component that uses the context
const RentReceiptContent = () => {
  const { 
    state, 
    handleDataChange, 
    handleBlur, 
    validateForm, 
    saveBill, 
    generatePDF 
  } = useBillContext();
  
  // Now you can use these functions and state in your component
  // ...
};
*/
