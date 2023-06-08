export interface IAddress {
  _id?: string;
  attn: string;
  unit?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  isDefault?: boolean;
}
