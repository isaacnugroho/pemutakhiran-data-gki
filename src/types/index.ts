// Location data types
export type LocationRow = [string, string, string, string, string];

// Form field mapping type
export interface FormFieldMapping {
  field: string;
  entryId: string;
}

// Field values type
export interface FieldValues {
  name: string;
  birthDate: string;
  birthPlace?: string;
  gender: string;
  phone: string;
  email?: string;
  address: string;
  rtrw: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  bloodType?: string;
  [key: string]: string | undefined; // Index signature for dynamic access
}

// Required field type
export interface RequiredField {
  id: string;
  message: string;
}

// Location data interface
export interface LocationData {
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  postalCode: string;
}
