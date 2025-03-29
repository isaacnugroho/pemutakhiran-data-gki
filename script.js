const FORM_ID = process.env.FORM_ID;

// Function to load the location data from the external file
async function loadLocationData() {
    try {
        // Show loading indicator with "Loading data..." message
        const loadingIndicator = document.getElementById('loadingIndicator');
        const loadingText = document.getElementById('loadingText');
        loadingIndicator.style.display = 'block';
        loadingText.textContent = 'Loading data...';
        
        // Check if LOCATION_DATA is already loaded (from the external script)
        if (typeof LOCATION_DATA !== 'undefined') {
            console.log('Location data already loaded from script tag');
            updateProgressIndicator('Processing data...', 25);
            return await processLocationData(LOCATION_DATA);
        }
        
        // If not loaded via script tag, fetch it
        console.log('Fetching location data from file');
        updateProgressIndicator('Fetching location data...', 10);
        
        const response = await fetch('location-data.js');
        if (!response.ok) {
            throw new Error(`Failed to load location data: ${response.status} ${response.statusText}`);
        }
        
        updateProgressIndicator('Downloading data...', 30);
        const dataText = await response.text();
        console.log('Received data text:', dataText.substring(0, 100) + '...');
        
        updateProgressIndicator('Parsing data...', 50);
        // Extract the array from the text (simple approach)
        const arrayMatch = dataText.match(/LOCATION_DATA\s*=\s*\[([\s\S]*?)\];/);
        if (!arrayMatch || !arrayMatch[1]) {
            throw new Error('Failed to parse location data');
        }
        
        // Create the array by evaluating the extracted content
        const locationDataString = `[${arrayMatch[1]}]`;
        updateProgressIndicator('Preparing data...', 70);
        const locationData = eval(locationDataString); // Note: eval is used for simplicity, consider safer alternatives in production
        
        return await processLocationData(locationData);
    } catch (error) {
        console.error('Error loading location data:', error);
        // Update loading indicator to show error
        const loadingIndicator = document.getElementById('loadingIndicator');
        const loadingText = document.getElementById('loadingText');
        loadingText.textContent = 'Failed to load data. Please refresh the page.';
        loadingText.style.color = 'red';
        
        // Show error toast
        M.toast({html: 'Failed to load location data. Please refresh the page.', classes: 'rounded red'});
    }
}

// Helper function to update the progress indicator
function updateProgressIndicator(message, percentage) {
    const loadingText = document.getElementById('loadingText');
    if (loadingText) {
        loadingText.textContent = `${message} (${percentage}%)`;
    }
    // You could also update a progress bar here if you have one
}

// Function to process the location data into a usable format
async function processLocationData(locationData) {
    try {
        // Update loading message
        updateProgressIndicator('Processing data...', 80);
        
        console.log('Processing location data:', locationData);
        
        // Process the location data
        // Using setTimeout and Promise to allow UI to update and show progress
        await new Promise(resolve => setTimeout(resolve, 100));
        
        updateProgressIndicator('Converting data format...', 85);
        const rows = locationData.map(location => {
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
        
        updateProgressIndicator('Populating dropdowns...', 90);
        // Populate the province dropdown
        await new Promise(resolve => setTimeout(resolve, 100));
        populateProvinceDropdown(rows);
        
        updateProgressIndicator('Setting up interactions...', 95);
        // Setup event listeners for cascading dropdowns
        await new Promise(resolve => setTimeout(resolve, 100));
        setupCascadingDropdowns(rows);
        
        // Update loading indicator to show "Ready"
        updateProgressIndicator('Ready', 100);
        const loadingText = document.getElementById('loadingText');
        loadingText.style.color = '#26a69a';
        
        // Hide loading indicator after a short delay
        setTimeout(() => {
            document.getElementById('loadingIndicator').style.display = 'none';
        }, 1000);
        
        return rows;
    } catch (error) {
        console.error('Error processing location data:', error);
        // Update loading indicator to show error
        const loadingText = document.getElementById('loadingText');
        loadingText.textContent = 'Error processing data. Please refresh the page.';
        loadingText.style.color = 'red';
        
        // Show error toast
        M.toast({html: 'Failed to process location data. Please try again later.', classes: 'rounded red'});
    }
}

// Function to populate the province dropdown
function populateProvinceDropdown(rows) {
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
    const provinceDropdown = document.getElementById('provinceDropdown');
    const cityDropdown = document.getElementById('cityDropdown');
    const districtDropdown = document.getElementById('districtDropdown');
    const subDistrictDropdown = document.getElementById('subDistrictDropdown');
    const postalCodeInput = document.getElementById('postalCode');
    
    if (!provinceDropdown || !cityDropdown || !districtDropdown || !subDistrictDropdown || !postalCodeInput) return;
    
    // When province is selected, populate cities
    provinceDropdown.addEventListener('change', function() {
        const selectedProvince = this.value;
        
        // Enable city dropdown
        cityDropdown.disabled = false;
        
        // Filter rows for the selected province
        // Province is in column 0, city is in column 1
        const cities = [...new Set(
            rows.filter(row => row[0] === selectedProvince)
                .map(row => row[1])
        )].filter(Boolean).sort();
        
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
        } else {
            postalCodeInput.value = '';
            M.updateTextFields(); // Update Materialize text fields
            console.warn('No postal code found for the selected location');
        }
    });
}

// Function to handle form submission
function handleFormSubmit() {
    // Trigger form validation
    if (!validateForm()) {
        return;
    }
    
    // Show loading indicator
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
    
    // Replace this URL with your actual Google Form URL
    // This is an example structure - you'll need to replace with your actual Google Form ID and field entry IDs
    // Format: https://docs.google.com/forms/d/e/[YOUR_FORM_ID]/viewform?usp=pp_url&entry.[FIELD_ID]=[VALUE]
    
    // Example Google Form URL (you need to replace with your actual form ID and entry IDs)
    const googleFormBaseUrl = 'https://docs.google.com/forms/d/e/' + FORM_ID + '/viewform';
    
    // Build the URL with prefilled values
    // Note: You need to replace these entry IDs with the actual IDs from your Google Form
    const prefilledUrl = `${googleFormBaseUrl}?usp=pp_url&entry.123456=${encodeURIComponent(name)}&entry.234567=${encodeURIComponent(email)}&entry.345678=${encodeURIComponent(phone)}&entry.456789=${encodeURIComponent(fullAddress)}&entry.567890=${encodeURIComponent(province)}&entry.678901=${encodeURIComponent(city)}&entry.789012=${encodeURIComponent(district)}&entry.890123=${encodeURIComponent(subDistrict)}&entry.901234=${encodeURIComponent(postalCode)}`;
    
    // Show toast notification
    M.toast({html: 'Submitting form...', classes: 'rounded'});
    
    // Redirect to the Google Form after a short delay
    setTimeout(function() {
        window.open(prefilledUrl, '_blank');
        // Hide loading indicator after redirect
        loadingIndicator.style.display = 'none';
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

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Material components
    M.AutoInit();
    
    // Specifically initialize select dropdowns with custom options
    const selects = document.querySelectorAll('select');
    M.FormSelect.init(selects, {
        dropdownOptions: {
            coverTrigger: false,
            constrainWidth: false
        }
    });

    // Initialize textarea specifically for address
    M.textareaAutoResize(document.getElementById('address'));
    
    // Load location data
    loadLocationData();
    
    const form = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    // Add click event listener to the submit button
    submitButton.addEventListener('click', handleFormSubmit);    
});
