// Process the location data into a usable format
function processLocationData() {
    console.log('Processing location data...');
    
    // Process the location data
    const rows = LOCATION_DATA.map(location => {
        const parts = location.split('|');
        return [
            parts[0] || '', // Province
            parts[1] || '', // City
            parts[2] || '', // District
            parts[3] || '', // SubDistrict
            parts[4] || ''  // PostalCode
        ];
    });
    
    console.log(`Processed ${rows.length} locations`);
    
    // Store the data for later use
    window.locationData = rows;
    
    return rows;
}

// Function to populate the province dropdown
function populateProvinceDropdown(rows) {
    console.log('Populating province dropdown...');
    const provinceDropdown = document.getElementById('provinceDropdown');
    if (!provinceDropdown) return;
    
    // Get unique provinces (first column, index 0)
    const provinces = [...new Set(rows.map(row => row[0]))].filter(Boolean).sort();
    
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
    M.FormSelect.init(provinceDropdown, {
        dropdownOptions: {
            coverTrigger: false,
            constrainWidth: false
        }
    });
}

// Function to setup event listeners for cascading dropdowns
function setupCascadingDropdowns(rows) {
    console.log('Setting up cascading dropdowns...');
    const provinceDropdown = document.getElementById('provinceDropdown');
    const cityDropdown = document.getElementById('cityDropdown');
    const districtDropdown = document.getElementById('districtDropdown');
    const subDistrictDropdown = document.getElementById('subDistrictDropdown');
    const postalCodeInput = document.getElementById('postalCode');
    
    if (!provinceDropdown || !cityDropdown || !districtDropdown || !subDistrictDropdown || !postalCodeInput) {
        console.error('One or more dropdown elements not found');
        return;
    }
    
    // When province is selected, populate cities
    provinceDropdown.addEventListener('change', function() {
        console.log('Province changed:', this.value);
        const selectedProvince = this.value;
        
        // Enable city dropdown
        cityDropdown.disabled = false;
        
        // Filter rows for the selected province
        // Province is in column 0, city is in column 1
        const cities = [...new Set(
            rows.filter(row => row[0] === selectedProvince)
                .map(row => row[1])
        )].filter(Boolean).sort();
        
        console.log('Cities for', selectedProvince, ':', cities);
        
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
        M.updateTextFields(); // Update Materialize text fields
        
        // Re-initialize Materialize selects with custom options
        const dropdownOptions = {
            dropdownOptions: {
                coverTrigger: false,
                constrainWidth: false
            }
        };
        M.FormSelect.init(cityDropdown, dropdownOptions);
        M.FormSelect.init(districtDropdown, dropdownOptions);
        M.FormSelect.init(subDistrictDropdown, dropdownOptions);
    });
    
    // When city is selected, populate districts
    cityDropdown.addEventListener('change', function() {
        console.log('City changed:', this.value);
        const selectedProvince = provinceDropdown.value;
        const selectedCity = this.value;
        
        // Enable district dropdown
        districtDropdown.disabled = false;
        
        // Filter rows for the selected province and city
        // Province is in column 0, city is in column 1, district is in column 2
        const districts = [...new Set(
            rows.filter(row => row[0] === selectedProvince && row[1] === selectedCity)
                .map(row => row[2])
        )].filter(Boolean).sort();
        
        console.log('Districts for', selectedCity, ':', districts);
        
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
        M.updateTextFields(); // Update Materialize text fields
        
        // Re-initialize Materialize selects with custom options
        const dropdownOptions = {
            dropdownOptions: {
                coverTrigger: false,
                constrainWidth: false
            }
        };
        M.FormSelect.init(districtDropdown, dropdownOptions);
        M.FormSelect.init(subDistrictDropdown, dropdownOptions);
    });
    
    // When district is selected, populate sub-districts
    districtDropdown.addEventListener('change', function() {
        console.log('District changed:', this.value);
        const selectedProvince = provinceDropdown.value;
        const selectedCity = cityDropdown.value;
        const selectedDistrict = this.value;
        
        // Enable sub-district dropdown
        subDistrictDropdown.disabled = false;
        
        // Filter rows for the selected province, city, and district
        // Province is in column 0, city is in column 1, district is in column 2, sub-district is in column 3
        const subDistricts = [...new Set(
            rows.filter(row => 
                row[0] === selectedProvince && 
                row[1] === selectedCity && 
                row[2] === selectedDistrict
            ).map(row => row[3])
        )].filter(Boolean).sort();
        
        console.log('Sub-districts for', selectedDistrict, ':', subDistricts);
        
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
        M.updateTextFields(); // Update Materialize text fields
        
        // Re-initialize Materialize select with custom options
        M.FormSelect.init(subDistrictDropdown, {
            dropdownOptions: {
                coverTrigger: false,
                constrainWidth: false
            }
        });
    });
    
    // When sub-district is selected, set postal code
    subDistrictDropdown.addEventListener('change', function() {
        console.log('Sub-district changed:', this.value);
        const selectedProvince = provinceDropdown.value;
        const selectedCity = cityDropdown.value;
        const selectedDistrict = districtDropdown.value;
        const selectedSubDistrict = this.value;
        
        // Find the matching row to get the postal code
        // Province is in column 0, city is in column 1, district is in column 2, sub-district is in column 3, postal code is in column 4
        const matchingRow = rows.find(row => 
            row[0] === selectedProvince && 
            row[1] === selectedCity && 
            row[2] === selectedDistrict && 
            row[3] === selectedSubDistrict
        );
        
        // Set postal code if found
        if (matchingRow && matchingRow[4]) {
            postalCodeInput.value = matchingRow[4];
            M.updateTextFields(); // Update Materialize text fields
            console.log('Postal code set to', matchingRow[4]);
        } else {
            postalCodeInput.value = '';
            M.updateTextFields(); // Update Materialize text fields
            console.warn('No postal code found for the selected location');
        }
    });
}

// Function to handle form submission
function handleFormSubmit() {
    console.log('Form submitted');
    
    // Trigger form validation
    if (!validateForm()) {
        return;
    }
    
    // Show loading indicator
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';
    document.getElementById('loadingText').textContent = 'Submitting your information...';
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const province = document.getElementById('provinceDropdown').value;
    const city = document.getElementById('cityDropdown').value;
    const district = document.getElementById('districtDropdown').value;
    const subDistrict = document.getElementById('subDistrictDropdown').value;
    const postalCode = document.getElementById('postalCode').value;
    const address = document.getElementById('address').value;
    
    // Format the full address with the selected regions
    const fullAddress = `${address}, ${subDistrict}, ${district}, ${city}, ${province} ${postalCode}`;
    
    console.log('Submitting form with data:', {
        name,
        email,
        phone,
        address: fullAddress,
        province,
        city,
        district,
        subDistrict,
        postalCode
    });
    
    // Show toast notification
    M.toast({html: 'Submitting form...', classes: 'rounded'});
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(function() {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        
        // Show success message
        M.toast({html: 'Form submitted successfully!', classes: 'rounded green'});
    }, 1500);
}

// Function to validate the form
function validateForm() {
    // Check required fields
    const requiredFields = [
        { id: 'name', label: 'Name' },
        { id: 'email', label: 'Email' },
        { id: 'provinceDropdown', label: 'Province' },
        { id: 'cityDropdown', label: 'City' },
        { id: 'districtDropdown', label: 'District' },
        { id: 'subDistrictDropdown', label: 'Sub-district' }
    ];
    
    let isValid = true;
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element.value) {
            M.toast({html: `${field.label} is required`, classes: 'rounded red'});
            isValid = false;
        }
    });
    
    // Validate email format if provided
    const email = document.getElementById('email').value;
    if (email && !isValidEmail(email)) {
        M.toast({html: 'Please enter a valid email address', classes: 'rounded red'});
        isValid = false;
    }
    
    return isValid;
}

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize the form when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing form...');
    
    // Show loading indicator
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';
    
    // Initialize Material components
    M.AutoInit();
    
    // Initialize textarea specifically for address
    M.textareaAutoResize(document.getElementById('address'));
    
    // Process location data
    const locationData = processLocationData();
    
    // Populate province dropdown
    populateProvinceDropdown(locationData);
    
    // Setup cascading dropdowns
    setupCascadingDropdowns(locationData);
    
    // Add click event listener to the submit button
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', handleFormSubmit);
    
    // Hide loading indicator
    setTimeout(() => {
        loadingIndicator.style.display = 'none';
    }, 500);
});
