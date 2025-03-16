# Bill Generator Utilities

This directory contains shared utility modules that can be optionally used to enhance and standardize bill generation functionality across different bill types.

## Available Utilities

### 1. Bill Generation Module (`billGeneration.ts`)

Provides reusable functions for PDF generation and credit management.

**Key Functions:**
- `generatePDF`: Creates a PDF from an HTML element with watermark removal
- `updateCredits`: Updates user credits after bill generation
- `checkCredits`: Verifies if the user has sufficient credits

**Example Usage:**
```typescript
import { generatePDF, checkCredits, updateCredits } from '@/utils/billGeneration';

// In your component
const generateBill = async () => {
  // Check credits
  const hasCredits = await checkCredits(session.status, setError);
  if (!hasCredits) return;
  
  // Generate PDF
  await generatePDF({
    elementId: 'billPreview',
    fileName: 'MyBill.pdf',
    successCallback: () => console.log('Success!'),
    errorCallback: (error) => setError(error.message),
  });
  
  // Update credits
  await updateCredits(session.status);
};
```

### 2. Form Validation Module (`formValidation.ts`)

Provides a React hook and validation rules for consistent form handling.

**Key Features:**
- `useFormValidation`: A hook for managing form state and validation
- Pre-defined validation rules (required, minValue, maxValue, etc.)

**Example Usage:**
```typescript
import { useFormValidation, required, minValue } from '@/utils/formValidation';

const MyForm = () => {
  const validationRules = {
    name: [required('Name')],
    amount: [required('Amount'), minValue(0, 'Amount')],
  };
  
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
  } = useFormValidation({
    initialValues: { name: '', amount: 0 },
    validationRules,
  });
  
  const handleSubmit = () => {
    if (validateForm()) {
      // Form is valid, proceed
    }
  };
  
  return (
    <form>
      <input
        value={values.name}
        onChange={(e) => handleChange('name', e.target.value)}
        onBlur={() => handleBlur('name')}
      />
      {errors.name && <div className="error">{errors.name}</div>}
      
      {/* More fields */}
    </form>
  );
};
```

### 3. Template Registry (`templates/registry.ts`)

Provides a centralized registry for managing bill templates.

**Key Features:**
- Register templates for different bill types
- Retrieve templates by type or ID
- Render templates with appropriate props

**Example Usage:**
```typescript
import templateRegistry, { BillType } from '@/templates/registry';
import MyTemplate from '@/components/bills/MyTemplate';

// Register a template
templateRegistry.registerTemplate({
  id: 'my-template',
  name: 'My Custom Template',
  description: 'A professional bill template',
  billType: BillType.RENT,
  render: (props) => <MyTemplate {...props} />,
});

// Get templates for a bill type
const rentTemplates = templateRegistry.getTemplatesByType(BillType.RENT);

// Render a specific template
const BillPreview = () => {
  const billData = { /* ... */ };
  
  return (
    <div className="preview">
      {templateRegistry.renderTemplate('my-template', BillType.RENT, billData)}
    </div>
  );
};
```

### 4. Bill Context Provider (`contexts/BillContext.tsx`)

Provides a context for managing bill state and operations.

**Key Features:**
- Centralized state management for bills
- Form validation
- API operations (save, fetch)
- PDF generation

**Example Usage:**
```typescript
import { BillProvider, useBillContext } from '@/contexts/BillContext';

// In your app
const RentReceiptPage = () => {
  return (
    <BillProvider
      billType="rent"
      validationRules={{
        landlordName: (value) => !value ? 'Required' : null,
        // More rules
      }}
      requiredFields={['landlordName', 'tenantName']}
    >
      <RentContent />
    </BillProvider>
  );
};

// In your component
const RentContent = () => {
  const {
    state,
    handleDataChange,
    handleBlur,
    validateForm,
    generatePDF,
  } = useBillContext();
  
  return (
    <div>
      <input
        value={state.billData.landlordName}
        onChange={(e) => handleDataChange({ landlordName: e.target.value })}
        onBlur={() => handleBlur('landlordName', state.billData.landlordName)}
      />
      {state.fieldErrors.landlordName && <div>{state.fieldErrors.landlordName}</div>}
      
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};
```

### 5. Generic Bill Component (`components/common/GenericBill.tsx`)

A reusable component for bill generation that can be extended for different bill types.

**Key Features:**
- Common UI structure for all bill types
- Template selection
- Form validation
- PDF generation
- Bill saving

**Example Usage:**
```typescript
import GenericBill from '@/components/common/GenericBill';
import MyTemplateSelector from '@/components/bills/MyTemplateSelector';
import MyEditor from '@/components/bills/MyEditor';
import MyPreview from '@/components/bills/MyPreview';

const MyBillPage = () => {
  return (
    <GenericBill
      billType="mybill"
      icon={<MyIcon />}
      title="My Bill Generator"
      subtitle="Create professional bills"
      
      renderTemplateSelector={({ selectedTemplate, onSelectTemplate }) => (
        <MyTemplateSelector
          selectedTemplate={selectedTemplate}
          onSelectTemplate={onSelectTemplate}
        />
      )}
      
      renderEditor={({ data, onDataChange, fieldErrors, handleBlur }) => (
        <MyEditor
          data={data}
          onDataChange={onDataChange}
          fieldErrors={fieldErrors}
          handleBlur={handleBlur}
        />
      )}
      
      renderPreview={({ data, selectedTemplate }) => (
        <MyPreview data={data} template={selectedTemplate} />
      )}
      
      validateForm={(data) => {
        // Validation logic
        return { isValid: true, errors: {} };
      }}
      
      formatBillDataForAPI={(data, name) => {
        // Format data for API
        return { name, ...data };
      }}
      
      parseBillDataFromAPI={(apiData) => {
        // Parse API data
        return apiData;
      }}
      
      generateFileName={(data) => `Bill_${data.id}.pdf`}
    />
  );
};
```

## How to Use With Existing Code

These utilities are designed to work alongside existing code without requiring modifications. You can gradually adopt them in your bill components as needed.

1. Start by using individual utility functions from `billGeneration.ts` or validation rules from `formValidation.ts`
2. For new bill types, consider using the `GenericBill` component as a starting point
3. As you refactor existing bill types, you can gradually adopt the context provider pattern

Remember that these utilities are entirely optional and can be used incrementally without breaking existing functionality. 