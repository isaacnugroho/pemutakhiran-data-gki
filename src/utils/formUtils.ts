import { FormFieldMapping, FieldValues, RequiredField } from '../types';

// Define the location data interface
interface LocationData {
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  postalCode: string;
}

// Prefilled form ID
let PREFILLED_FORM_ID = 'not_the_actual_PREFILLED_FORM_ID';

/**
 * Updates the progress indicator with a message and percentage
 */
export const updateProgressIndicator = (message: string, percentage: number): void => {
  if (typeof document !== 'undefined') {
    const loadingText = document.getElementById('loadingText');
    if (loadingText) {
      loadingText.textContent = message;
    }
    // Could add a progress bar here if needed
    console.log(`Progress: ${percentage}% - ${message}`);
  }
};

/**
 * Loads location data from the external file
 */
export const loadLocationData = async (): Promise<LocationData[]> => {
  try {
    // Show loading indicator with "Loading data..." message
    if (typeof document !== 'undefined') {
      const loadingIndicator = document.getElementById('loadingIndicator');
      const loadingText = document.getElementById('loadingText');
      if (loadingIndicator) loadingIndicator.style.display = 'block';
      if (loadingText) loadingText.textContent = 'Loading data...';
    }

    // If not loaded via script tag, fetch it
    console.log('Fetching location data from file');
    updateProgressIndicator('Fetching location data...', 10);

    const response = await fetch('/api/location-data');
    if (!response.ok) {
      throw new Error(`Failed to load location data: ${response.status} ${response.statusText}`);
    }

    updateProgressIndicator('Downloading data...', 30);
    const locationData: LocationData[] = await response.json();
    console.log('Received location data:', locationData.slice(0, 2));

    updateProgressIndicator('Processing data...', 50);
    return await processLocationData(locationData);
  } catch (error) {
    console.error('Error loading location data:', error);
    if (typeof document !== 'undefined') {
      const loadingText = document.getElementById('loadingText');
      if (loadingText) {
        loadingText.textContent = 'Failed to load data. Please refresh the page.';
        loadingText.style.color = 'red';
      }
      
      // Show error toast if Materialize is available
      if ((window as any).M && (window as any).M.toast) {
        (window as any).M.toast({
          html: 'Failed to load location data. Please refresh the page.',
          classes: 'rounded red'
        });
      }
    }
    return [];
  }
};

/**
 * Process the location data into a usable format
 */
export const processLocationData = async (locationData: LocationData[]): Promise<LocationData[]> => {
  try {
    // Update loading message
    updateProgressIndicator('Processing data...', 80);

    console.log('Processing location data:', locationData.slice(0, 2));

    // Store the data for later use
    if (typeof window !== 'undefined') {
      (window as any).locationData = locationData;
    }

    updateProgressIndicator('Populating dropdowns...', 90);
    // Populate the province dropdown
    await populateProvinceDropdown(locationData);

    updateProgressIndicator('Setting up interactions...', 95);
    // Setup event listeners for cascading dropdowns
    await setupCascadingDropdowns(locationData);

    // Update loading indicator to show "Ready"
    updateProgressIndicator('Ready', 100);
    if (typeof document !== 'undefined') {
      const loadingText = document.getElementById('loadingText');
      if (loadingText) {
        loadingText.textContent = 'Ready';
        loadingText.style.color = 'green';
      }

      // Hide loading indicator after a short delay
      setTimeout(() => {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) loadingIndicator.style.display = 'none';
      }, 1000);
    }

    return locationData;
  } catch (error) {
    console.error('Error processing location data:', error);
    if (typeof document !== 'undefined') {
      const loadingText = document.getElementById('loadingText');
      if (loadingText) {
        loadingText.textContent = 'Error processing data. Please refresh the page.';
        loadingText.style.color = 'red';
      }
      
      // Show error toast if Materialize is available
      if ((window as any).M && (window as any).M.toast) {
        (window as any).M.toast({
          html: 'Failed to process location data. Please try again later.',
          classes: 'rounded red'
        });
      }
    }
    return [];
  }
};

/**
 * Populates the province dropdown with data
 */
export const populateProvinceDropdown = async (locations: LocationData[]): Promise<void> => {
  if (typeof document === 'undefined') return;
  
  const provinceDropdown = document.getElementById('provinceDropdown') as HTMLSelectElement;
  if (!provinceDropdown) return;

  console.log('Populating province dropdown with data:', locations.slice(0, 2));

  // Get unique provinces using a Set and convert to Array
  const provinceSet = new Set<string>();
  locations.forEach(location => {
    if (location.province) {
      provinceSet.add(location.province);
    }
  });
  const provinces = Array.from(provinceSet).sort();

  // Clear existing options
  provinceDropdown.innerHTML = '';

  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Pilih Provinsi';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  provinceDropdown.appendChild(defaultOption);

  // Add options from data
  provinces.forEach(province => {
    const option = document.createElement('option');
    option.value = province;
    option.textContent = province;
    provinceDropdown.appendChild(option);
  });

  // Initialize Materialize select with custom options
  if ((window as any).M && (window as any).M.FormSelect) {
    (window as any).M.FormSelect.init(provinceDropdown, {
      dropdownOptions: {
        coverTrigger: false,
        autoFocus: false
      }
    });
  }
};

/**
 * Sets up event listeners for cascading dropdowns
 */
export const setupCascadingDropdowns = async (locations: LocationData[]): Promise<void> => {
  if (typeof document === 'undefined') return;
  
  const provinceDropdown = document.getElementById('provinceDropdown') as HTMLSelectElement;
  const cityDropdown = document.getElementById('cityDropdown') as HTMLSelectElement;
  const districtDropdown = document.getElementById('districtDropdown') as HTMLSelectElement;
  const subDistrictDropdown = document.getElementById('subDistrictDropdown') as HTMLSelectElement;
  const postalCodeInput = document.getElementById('postalCode') as HTMLInputElement;

  if (!provinceDropdown || !cityDropdown || !districtDropdown || !subDistrictDropdown || !postalCodeInput) return;

  console.log('Setting up cascading dropdowns with data:', locations.slice(0, 2));

  // When province is selected, populate cities
  provinceDropdown.addEventListener('change', function() {
    const selectedProvince = this.value;

    // Enable city dropdown
    cityDropdown.disabled = false;

    // Filter locations for the selected province
    const citySet = new Set<string>();
    locations.filter(location => location.province === selectedProvince)
      .forEach(location => {
        if (location.city) {
          citySet.add(location.city);
        }
      });
    const cities = Array.from(citySet).sort();

    // Clear existing options
    cityDropdown.innerHTML = '';

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Pilih Kota/Kabupaten';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    cityDropdown.appendChild(defaultOption);

    // Add options from filtered data
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      cityDropdown.appendChild(option);
    });

    // Reset and disable subsequent dropdowns
    districtDropdown.innerHTML = '<option value="" disabled selected>Pilih Kecamatan</option>';
    districtDropdown.disabled = true;

    subDistrictDropdown.innerHTML = '<option value="" disabled selected>Pilih Kelurahan</option>';
    subDistrictDropdown.disabled = true;

    // Clear postal code
    postalCodeInput.value = '';
    if ((window as any).M) (window as any).M.updateTextFields(); // Update Materialize text fields

    // Re-initialize Materialize selects with custom options
    const dropdownOptions = {
      dropdownOptions: {
        coverTrigger: false,
        autoFocus: false
      }
    };
    if ((window as any).M && (window as any).M.FormSelect) {
      (window as any).M.FormSelect.init(cityDropdown, dropdownOptions);
      (window as any).M.FormSelect.init(districtDropdown, dropdownOptions);
      (window as any).M.FormSelect.init(subDistrictDropdown, dropdownOptions);
    }
  });

  // When city is selected, populate districts
  cityDropdown.addEventListener('change', function() {
    const selectedProvince = provinceDropdown.value;
    const selectedCity = this.value;

    // Enable district dropdown
    districtDropdown.disabled = false;

    // Filter locations for the selected province and city
    const districtSet = new Set<string>();
    locations.filter(location => 
      location.province === selectedProvince && 
      location.city === selectedCity
    ).forEach(location => {
      if (location.district) {
        districtSet.add(location.district);
      }
    });
    const districts = Array.from(districtSet).sort();

    // Clear existing options
    districtDropdown.innerHTML = '';

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Pilih Kecamatan';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    districtDropdown.appendChild(defaultOption);

    // Add options from filtered data
    districts.forEach(district => {
      const option = document.createElement('option');
      option.value = district;
      option.textContent = district;
      districtDropdown.appendChild(option);
    });

    // Reset and disable subsequent dropdowns
    subDistrictDropdown.innerHTML = '<option value="" disabled selected>Pilih Kelurahan</option>';
    subDistrictDropdown.disabled = true;

    // Clear postal code
    postalCodeInput.value = '';
    if ((window as any).M) (window as any).M.updateTextFields(); // Update Materialize text fields

    // Re-initialize Materialize selects with custom options
    const dropdownOptions = {
      dropdownOptions: {
        coverTrigger: false,
        autoFocus: false
      }
    };
    if ((window as any).M && (window as any).M.FormSelect) {
      (window as any).M.FormSelect.init(districtDropdown, dropdownOptions);
      (window as any).M.FormSelect.init(subDistrictDropdown, dropdownOptions);
    }
  });

  // When district is selected, populate sub-districts
  districtDropdown.addEventListener('change', function() {
    const selectedProvince = provinceDropdown.value;
    const selectedCity = cityDropdown.value;
    const selectedDistrict = this.value;

    // Enable sub-district dropdown
    subDistrictDropdown.disabled = false;

    // Filter locations for the selected province, city, and district
    const subDistrictSet = new Set<string>();
    locations.filter(location => 
      location.province === selectedProvince && 
      location.city === selectedCity && 
      location.district === selectedDistrict
    ).forEach(location => {
      if (location.subDistrict) {
        subDistrictSet.add(location.subDistrict);
      }
    });
    const subDistricts = Array.from(subDistrictSet).sort();

    // Clear existing options
    subDistrictDropdown.innerHTML = '';

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Pilih Kelurahan';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    subDistrictDropdown.appendChild(defaultOption);

    // Add options from filtered data
    subDistricts.forEach(subDistrict => {
      const option = document.createElement('option');
      option.value = subDistrict;
      option.textContent = subDistrict;
      subDistrictDropdown.appendChild(option);
    });

    // Clear postal code
    postalCodeInput.value = '';
    if ((window as any).M) (window as any).M.updateTextFields(); // Update Materialize text fields

    // Re-initialize Materialize select with custom options
    if ((window as any).M && (window as any).M.FormSelect) {
      (window as any).M.FormSelect.init(subDistrictDropdown, {
        dropdownOptions: {
          coverTrigger: false,
          autoFocus: false
        }
      });
    }
  });

  // When sub-district is selected, set postal code
  subDistrictDropdown.addEventListener('change', function() {
    const selectedProvince = provinceDropdown.value;
    const selectedCity = cityDropdown.value;
    const selectedDistrict = districtDropdown.value;
    const selectedSubDistrict = this.value;

    // Find the matching location to get the postal code
    const matchingLocation = locations.find(location => 
      location.province === selectedProvince && 
      location.city === selectedCity && 
      location.district === selectedDistrict && 
      location.subDistrict === selectedSubDistrict
    );

    // Set postal code if found
    if (matchingLocation && matchingLocation.postalCode) {
      postalCodeInput.value = matchingLocation.postalCode;
      if ((window as any).M) (window as any).M.updateTextFields(); // Update Materialize text fields
    }
  });
};

/**
 * Handles form submission
 */
export const handleFormSubmit = (): void => {
  if (typeof document === 'undefined') return;
  
  // Show loading indicator
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) loadingIndicator.style.display = 'block';

  // Validate form
  if (!validateForm()) {
    // Hide loading indicator if validation fails
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    return;
  }

  // Get form values
  const name = (document.getElementById('name') as HTMLInputElement).value;
  // const email = (document.getElementById('email') as HTMLInputElement).value;
  const phone = (document.getElementById('phone') as HTMLInputElement).value;
  const birthPlace = (document.getElementById('birthPlace') as HTMLInputElement).value;
  const birthDate = (document.getElementById('birthDate') as HTMLInputElement).value;

  // Get gender value
  let gender = '';
  const genderRadios = document.querySelectorAll('input[name="gender"]') as NodeListOf<HTMLInputElement>;
  const genderRadiosArray = Array.from(genderRadios);
  for (const radio of genderRadiosArray) {
    if (radio.checked) {
      gender = radio.value;
      break;
    }
  }

  const province = (document.getElementById('provinceDropdown') as HTMLSelectElement).value;
  const city = (document.getElementById('cityDropdown') as HTMLSelectElement).value;
  const district = (document.getElementById('districtDropdown') as HTMLSelectElement).value;
  const subDistrict = (document.getElementById('subDistrictDropdown') as HTMLSelectElement).value;
  const postalCode = (document.getElementById('postalCode') as HTMLInputElement).value;
  const address = (document.getElementById('address') as HTMLTextAreaElement).value;
  const rtrw = (document.getElementById('rtrw') as HTMLTextAreaElement).value;

  // Example Google Form URL (you need to replace with your actual form ID and entry IDs)
  const googleFormBaseUrl = 'https://docs.google.com/forms/d/e/' + PREFILLED_FORM_ID + '/viewform';

  // Define form field mappings to Google Form entry IDs
  const formFieldMappings: FormFieldMapping[] = [
    { field: 'name', entryId: '1552198038' },
    { field: 'birthDate', entryId: '946724977' },
    { field: 'gender', entryId: '157174969' },
    { field: 'phone', entryId: '932581507' },
    { field: 'address', entryId: '670185927' },
    { field: 'rtrw', entryId: '1226075221' },
    { field: 'province', entryId: '1471260286' },
    { field: 'city', entryId: '198554559' },
    { field: 'district', entryId: '347596421' },
    { field: 'subDistrict', entryId: '687992146' },
    { field: 'postalCode', entryId: '56586160' }
  ];

  // Create a mapping of field names to their values
  const fieldValues: FieldValues = {
    name,
    birthDate,
    gender,
    phone,
    address,
    rtrw,
    province,
    city,
    district,
    subDistrict,
    postalCode
  };

  // Build the URL with prefilled values using the mappings
  let prefilledUrl = `${googleFormBaseUrl}?usp=pp_url`;
  formFieldMappings.forEach(mapping => {
    const value = fieldValues[mapping.field];
    prefilledUrl += `&entry.${mapping.entryId}=${encodeURIComponent(value || '')}`;
  });

  // Show toast notification if Materialize is available
  if ((window as any).M && (window as any).M.toast) {
    (window as any).M.toast({html: 'Submitting form...', classes: 'rounded'});
  }

  // Redirect to the Google Form after a short delay
  setTimeout(function() {
    window.open(prefilledUrl, '_blank');
    // Hide loading indicator after redirect
    if (loadingIndicator) loadingIndicator.style.display = 'none';
  }, 1500);
};

/**
 * Validates the form
 */
export const validateForm = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  // Check required fields
  const requiredFields: RequiredField[] = [
    { id: 'name', message: 'Please enter your name' },
    { id: 'birthDate', message: 'Please enter your birth date' },
    { id: 'address', message: 'Please enter your address' },
    { id: 'provinceDropdown', message: 'Please select a province' },
    { id: 'cityDropdown', message: 'Please select a city' },
    { id: 'districtDropdown', message: 'Please select a district' },
    { id: 'subDistrictDropdown', message: 'Please select a sub-district' }
  ];

  let isValid = true;

  // Check each required field
  for (const field of requiredFields) {
    const element = document.getElementById(field.id) as HTMLInputElement | HTMLSelectElement;
    if (!element || !element.value) {
      if ((window as any).M && (window as any).M.toast) {
        (window as any).M.toast({html: field.message, classes: 'rounded red'});
      }
      isValid = false;
      break;
    }
  }

  // Check gender selection
  if (isValid) {
    const genderSelected = document.querySelector('input[name="gender"]:checked');
    if (!genderSelected) {
      if ((window as any).M && (window as any).M.toast) {
        (window as any).M.toast({html: 'Please select your gender', classes: 'rounded red'});
      }
      isValid = false;
    }
  }

  // Validate email format if email field is not empty
  if (isValid) {
    const emailField = document.getElementById('email') as HTMLInputElement;
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
      if ((window as any).M && (window as any).M.toast) {
        (window as any).M.toast({html: 'Please enter a valid email address', classes: 'rounded red'});
      }
      isValid = false;
    }
  }

  // Validate blood type format if blood type field is not empty
  if (isValid) {
    const bloodTypeField = document.getElementById('bloodType') as HTMLInputElement;
    if (bloodTypeField && bloodTypeField.value && !isValidBloodType(bloodTypeField.value)) {
      if ((window as any).M && (window as any).M.toast) {
        (window as any).M.toast({html: 'Please enter a valid blood type (A, B, AB, O)', classes: 'rounded red'});
      }
      isValid = false;
    }
  }

  return isValid;
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates blood type format
 */
export const isValidBloodType = (bloodType: string): boolean => {
  const validBloodTypes = ['A', 'B', 'AB', 'O'];
  return validBloodTypes.includes(bloodType.trim().toUpperCase());
};

/**
 * Fetches the auth key from the API
 */
export const fetchAuthKey = async (): Promise<void> => {
  try {
    const response = await fetch('/api/getAuthKey');
    const data = await response.json();
    PREFILLED_FORM_ID = data.authKey;
    console.log("Form ID fetched successfully");
  } catch (error) {
    console.error("Error fetching auth key:", error);
  }
};

/**
 * Initializes the form
 */
export const initializeForm = (): void => {
  if (typeof document === 'undefined') return;
  
  // Call the function when the page loads
  fetchAuthKey();
  
  // Initialize Material components if available
  if ((window as any).M && (window as any).M.AutoInit) {
    (window as any).M.AutoInit();
  }
  
  // Initialize datepicker with custom options
  const datepicker = document.querySelector('.datepicker');
  if (datepicker && (window as any).M && (window as any).M.Datepicker) {
    (window as any).M.Datepicker.init(datepicker, {
      format: 'yyyy-mm-dd',
      yearRange: 50,
      showClearBtn: true,
      i18n: {
        cancel: 'Batal',
        clear: 'Hapus',
        done: 'OK',
        months: [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ],
        monthsShort: [
          'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
          'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
        ],
        weekdays: [
          'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
        ],
        weekdaysShort: [
          'Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'
        ],
        weekdaysAbbrev: ['M', 'S', 'S', 'R', 'K', 'J', 'S']
      }
    });
  }
  
  // Load location data
  loadLocationData();
  
  // Add event listener to the submit button
  const submitButton = document.getElementById('submitButton');
  if (submitButton) {
    submitButton.addEventListener('click', handleFormSubmit);
  }
};
