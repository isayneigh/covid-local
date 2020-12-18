export class GeoCodingHelper {

  public static getCountry(components: google.maps.GeocoderAddressComponent[]): google.maps.GeocoderAddressComponent {
    return components.find(comp => comp.types && comp.types.indexOf('country') !== -1);
  }

  public static getProvince(components: google.maps.GeocoderAddressComponent[]): google.maps.GeocoderAddressComponent {
    return components.find(comp => comp.types && comp.types.indexOf('administrative_area_level_1') !== -1);
  }

  public static getCounty(components: google.maps.GeocoderAddressComponent[]): google.maps.GeocoderAddressComponent {
    return components.find(comp => comp.types && comp.types.indexOf('administrative_area_level_2') !== -1);
  }
}
