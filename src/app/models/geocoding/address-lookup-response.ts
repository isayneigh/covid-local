export interface AddressLookupResponse {
  results: AddressData[];
}

export interface AddressData {
  address_components: AddressComponent[];
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: ('administrative_area_level_1' | 'administrative_area_level_2' | 'country')[];
}
