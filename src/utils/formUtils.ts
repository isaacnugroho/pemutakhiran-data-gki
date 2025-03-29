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
        (loadingText as HTMLElement).style.color = 'red';
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
        (loadingText as HTMLElement).style.color = 'green';
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
        (loadingText as HTMLElement).style.color = 'red';
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
 * Updates the submit progress indicator with a message
 */
export const updateSubmitProgress = (message: string): void => {
  if (typeof document === 'undefined') return;
  
  // Update progress text
  const progressText = document.getElementById('submitProgressText');
  if (progressText) {
    progressText.textContent = message;
  }
  
  // Show progress indicator if not already visible
  const progressIndicator = document.getElementById('submitProgress');
  if (progressIndicator) {
    (progressIndicator as HTMLElement).style.display = 'block';
  }
  
  // Log to console
  console.log(`Submit Progress: ${message}`);
};

/**
 * Handles form submission
 */
export const handleFormSubmit = (): void => {
  console.log('handleFormSubmit');
  if (typeof document === 'undefined') return;
  
  // Show loading indicator
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) (loadingIndicator as HTMLElement).style.display = 'block';
  
  // Show submit progress indicator
  const submitProgress = document.getElementById('submitProgress');
  if (submitProgress) (submitProgress as HTMLElement).style.display = 'block';
  
  // Log start of submission
  console.log('Starting form submission process');
  updateSubmitProgress('Validasi data...');

  // Validate form
  if (!validateForm()) {
    // Hide loading indicators if validation fails
    if (loadingIndicator) (loadingIndicator as HTMLElement).style.display = 'none';
    if (submitProgress) (submitProgress as HTMLElement).style.display = 'none';
    
    // Log validation failure
    console.error('Form validation failed');
    
    // Ensure postal code field is never marked as invalid
    const postalCodeField = document.getElementById('postalCode');
    if (postalCodeField) {
      postalCodeField.classList.remove('invalid');
      postalCodeField.classList.remove('valid');
    }
    
    // Show general validation error message
    if ((window as any).M && (window as any).M.toast) {
      (window as any).M.toast({
        html: 'Mohon periksa kembali data yang dimasukkan',
        classes: 'rounded red',
        displayLength: 4000
      });
    }
    return;
  }

  // Update progress
  updateSubmitProgress('Mengumpulkan data...');
  console.log('Form validation successful, collecting form data');

  // Get form values
  const name = (document.getElementById('name') as HTMLInputElement).value;
  const phone = (document.getElementById('phone') as HTMLInputElement).value;
  const birthPlace = (document.getElementById('birthPlace') as HTMLInputElement).value;
  const birthDate = (document.getElementById('birthDate') as HTMLInputElement).value;

  // Update progress
  updateSubmitProgress('Memproses jenis kelamin...');
  console.log('Processing gender selection');

  // Get gender value
  let gender = '';
  const genderRadios = document.querySelectorAll('input[name="gender"]') as NodeListOf<HTMLInputElement>;
  const genderRadiosArray = Array.from(genderRadios);
  const selectedGender = genderRadiosArray.find(radio => radio.checked);
  if (selectedGender) {
    gender = selectedGender.value;
  }

  // Update progress
  updateSubmitProgress('Memproses golongan darah...');
  console.log('Processing blood type');

  // Get blood type value
  const bloodType = (document.getElementById('bloodType') as HTMLInputElement).value;

  // Update progress
  updateSubmitProgress('Memproses alamat...');
  console.log('Processing address information');

  // Get address values
  const address = (document.getElementById('address') as HTMLTextAreaElement).value;
  const rtrw = (document.getElementById('rtrw') as HTMLTextAreaElement).value;
  const postalCode = (document.getElementById('postalCode') as HTMLInputElement).value;

  // Get location values
  const province = (document.getElementById('provinceDropdown') as HTMLSelectElement).value;
  const city = (document.getElementById('cityDropdown') as HTMLSelectElement).value;
  const district = (document.getElementById('districtDropdown') as HTMLSelectElement).value;
  const subDistrict = (document.getElementById('subDistrictDropdown') as HTMLSelectElement).value;

  // Update progress
  updateSubmitProgress('Menyiapkan data untuk pengiriman...');
  console.log('Preparing data for submission');

  // &entry.1276998498=nama
  // &entry.932581507=phone
  // &entry.1552198038=birthPlace
  // &entry.946724977=2025-05-05
  // &entry.157174969=Laki-laki
  // &entry.1949922653=AB%2B
  // &entry.670185927=address
  // &entry.1226075221=rtrw
  // &entry.1471260286=provinsi
  // &entry.198554559=kota
  // &entry.347596421=kecamatan
  // &entry.687992146=kelurahan
  // &entry.56586160=12345
  // Construct the prefilled URL
  const prefilledUrl = `https://docs.google.com/forms/d/e/${PREFILLED_FORM_ID}/viewform?usp=pp_url` +
    `&entry.1276998498=${encodeURIComponent(name)}` +
    `&entry.932581507=${encodeURIComponent(phone)}` +
    `&entry.1552198038=${encodeURIComponent(birthPlace)}` +
    `&entry.946724977=${encodeURIComponent(birthDate)}` +
    `&entry.157174969=${encodeURIComponent(gender)}` +
    `&entry.1949922653=${encodeURIComponent(bloodType)}` +
    `&entry.670185927=${encodeURIComponent(address)}` +
    `&entry.1226075221=${encodeURIComponent(rtrw)}` +
    `&entry.1471260286=${encodeURIComponent(province)}` +
    `&entry.198554559=${encodeURIComponent(city)}` +
    `&entry.347596421=${encodeURIComponent(district)}` +
    `&entry.687992146=${encodeURIComponent(subDistrict)}` +
    `&entry.56586160=${encodeURIComponent(postalCode)}`;

  // Update progress
  updateSubmitProgress('Mengirim data...');
  console.log('Sending data to Google Form');
  console.log('Form URL:', prefilledUrl);

  // Show success message
  if ((window as any).M && (window as any).M.toast) {
    (window as any).M.toast({html: 'Data berhasil dikirim!', classes: 'rounded green'});
  }

  // Update progress
  updateSubmitProgress('Membuka formulir Google...');
  console.log('Opening Google Form in new tab');

  // Redirect to the Google Form after a short delay
  setTimeout(function() {
    window.open(prefilledUrl, '_blank');
    
    // Update progress
    updateSubmitProgress('Selesai!');
    console.log('Form submission process completed');
    
    // Hide loading indicator after redirect
    if (loadingIndicator) (loadingIndicator as HTMLElement).style.display = 'none';
    
    // Hide submit progress after a short delay
    setTimeout(function() {
      if (submitProgress) (submitProgress as HTMLElement).style.display = 'none';
    }, 2000);
  }, 1500);
};

/**
 * Validates the form
 */
export const validateForm = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  // Clear previous validation errors
  clearValidationErrors();
  
  // Check required fields
  const requiredFields: RequiredField[] = [
    { id: 'name', message: 'Nama lengkap harus diisi' },
    { id: 'phone', message: 'Nomor telepon harus diisi' },
    { id: 'birthDate', message: 'Tanggal lahir harus diisi' },
    { id: 'address', message: 'Alamat lengkap harus diisi' },
    { id: 'provinceDropdown', message: 'Provinsi harus dipilih' },
    { id: 'cityDropdown', message: 'Kota/Kabupaten harus dipilih' },
    { id: 'districtDropdown', message: 'Kecamatan harus dipilih' },
    { id: 'subDistrictDropdown', message: 'Kelurahan harus dipilih' }
  ];

  let isValid = true;

  // Check each required field
  for (const field of requiredFields) {
    const element = document.getElementById(field.id) as HTMLInputElement | HTMLSelectElement;
    if (!element || !element.value) {
      showFieldError(field.id, field.message);
      isValid = false;
    } else {
      showFieldSuccess(field.id);
    }
  }

  // Check gender selection
  const genderSelected = document.querySelector('input[name="gender"]:checked');
  if (!genderSelected) {
    showFieldError('gender-label', 'Jenis kelamin harus dipilih');
    isValid = false;
  } else {
    showFieldSuccess('gender-label');
  }

  // Validate blood type format if blood type field is not empty
  const bloodTypeField = document.getElementById('bloodType') as HTMLInputElement;
  if (bloodTypeField && bloodTypeField.value && !isValidBloodType(bloodTypeField.value)) {
    showFieldError('bloodType', 'Golongan darah tidak valid (A, B, AB, O, A+, A-, B+, B-, AB+, AB-, O+, O-)');
    isValid = false;
  } else if (bloodTypeField && bloodTypeField.value) {
    showFieldSuccess('bloodType');
  }

  return isValid;
};

/**
 * Shows an error message for a specific field
 */
const showFieldError = (fieldId: string, message: string): void => {
  const element = document.getElementById(fieldId);
  if (!element) return;
  
  // Add invalid class to the input
  element.classList.add('invalid');
  element.classList.remove('valid');
  
  // For select elements, we need to handle differently
  if (element.tagName === 'SELECT') {
    const parentElement = element.parentElement;
    if (parentElement) {
      // Find or create helper text element in the parent
      let helperElement = parentElement.querySelector('.helper-text');
      
      if (!helperElement) {
        // Create helper text if it doesn't exist
        helperElement = document.createElement('span');
        helperElement.className = 'helper-text';
        parentElement.appendChild(helperElement);
      }
      
      // Set error message
      helperElement.textContent = message;
      (helperElement as HTMLElement).style.color = '#F44336';
    }
  } else {
    // For regular inputs
    // Find existing helper text or create one
    const parentElement = element.parentElement;
    if (!parentElement) return;
    
    let helperElement = parentElement.querySelector('.helper-text');
    
    if (!helperElement) {
      // Create helper text if it doesn't exist
      helperElement = document.createElement('span');
      helperElement.className = 'helper-text';
      parentElement.appendChild(helperElement);
    }
    
    // Set error message
    helperElement.textContent = message;
    (helperElement as HTMLElement).style.color = '#F44336';
  }
  
  // Also show toast for accessibility
  if ((window as any).M && (window as any).M.toast) {
    (window as any).M.toast({html: message, classes: 'rounded red'});
  }
};

/**
 * Shows success state for a specific field
 */
const showFieldSuccess = (fieldId: string): void => {
  const element = document.getElementById(fieldId);
  if (!element) return;
  
  // Add valid class to the input
  element.classList.add('valid');
  element.classList.remove('invalid');
  
  // Find helper text element if it exists
  const parentElement = element.parentElement;
  if (!parentElement) return;
  
  const helperElement = parentElement.querySelector('.helper-text');
  
  // Clear error message if helper exists
  if (helperElement) {
    helperElement.textContent = '';
    (helperElement as HTMLElement).style.color = '';
  }
};

/**
 * Clears all validation errors
 */
const clearValidationErrors = (): void => {
  // Clear all invalid classes
  const invalidElements = document.querySelectorAll('.invalid');
  invalidElements.forEach(element => {
    element.classList.remove('invalid');
  });
  
  // Clear all helper text error messages
  const helperElements = document.querySelectorAll('.helper-text');
  helperElements.forEach(element => {
    element.textContent = '';
    (element as HTMLElement).style.color = '';
  });
  
  // Ensure postal code field is never marked as invalid
  const postalCodeField = document.getElementById('postalCode');
  if (postalCodeField) {
    postalCodeField.classList.remove('invalid');
    postalCodeField.classList.remove('valid');
  }
};

/**
 * Validates blood type format
 */
export const isValidBloodType = (bloodType: string): boolean => {
  // Empty blood type is valid
  if (!bloodType || bloodType.trim() === '') {
    return true;
  }
  
  // Valid blood types with or without Rhesus factor
  const validBloodTypes = ['A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
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
  
  // Initialize datepicker with custom options - with a slight delay to ensure DOM is ready
  setTimeout(() => {
    const datepickers = document.querySelectorAll('.datepicker');
    console.log('Found datepickers:', datepickers.length);
    
    if (datepickers.length > 0 && (window as any).M && (window as any).M.Datepicker) {
      datepickers.forEach(datepicker => {
        const instance = (window as any).M.Datepicker.init(datepicker, {
          format: 'yyyy-mm-dd',
          yearRange: 100,
          maxDate: new Date(), // Set maximum date to today
          showClearBtn: true,
          autoClose: true,
          firstDay: 1, // Monday
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
        console.log('Datepicker initialized:', instance);
      });
    }
  }, 500);
  
  // Load location data
  loadLocationData();
  
  // Setup blood type validation
  setupBloodTypeValidation();
};

/**
 * Sets up blood type validation
 */
const setupBloodTypeValidation = (): void => {
  // Wait for DOM to be fully loaded
  setTimeout(() => {
    const bloodTypeField = document.getElementById('bloodType') as HTMLInputElement;
    if (bloodTypeField) {
      console.log('Setting up blood type validation');
      
      // Initial validation
      if (bloodTypeField.value) {
        bloodTypeField.value = bloodTypeField.value.toUpperCase();
      }
      
      // Add input event listener
      bloodTypeField.addEventListener('input', function() {
        // Convert to uppercase
        this.value = this.value.toUpperCase();
        
        // Validate as user types
        if (this.value && !isValidBloodType(this.value)) {
          this.classList.add('invalid');
          this.classList.remove('valid');
          
          // Show toast message for invalid input
          if ((window as any).M && (window as any).M.toast) {
            (window as any).M.toast({
              html: 'Valid blood types: A, B, AB, O, A+, A-, B+, B-, AB+, AB-, O+, O-',
              classes: 'rounded orange',
              displayLength: 2000
            });
          }
        } else {
          this.classList.remove('invalid');
          if (this.value) {
            this.classList.add('valid');
          }
        }
      });
      
      // Add blur event for final validation
      bloodTypeField.addEventListener('blur', function() {
        if (this.value && !isValidBloodType(this.value)) {
          this.classList.add('invalid');
          this.value = ''; // Clear invalid input
          
          // Show toast message for invalid input
          if ((window as any).M && (window as any).M.toast) {
            (window as any).M.toast({
              html: 'Invalid blood type cleared. Valid types: A, B, AB, O, A+, A-, B+, B-, AB+, AB-, O+, O-',
              classes: 'rounded red'
            });
          }
        }
      });
    }
  }, 500); // Short delay to ensure DOM is ready
};
