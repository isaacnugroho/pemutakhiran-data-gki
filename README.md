# Material Design Form to Google Form

This is a simple HTML form using Material Design that collects user information and redirects to a Google Form with prefilled values upon submission.

## Features

- Modern Material Design UI components
- Responsive layout that works on all device sizes
- Form validation
- Smooth transitions and animations
- Toast notifications

## How to Use

1. Open `index.html` in a web browser
2. Fill out the form with your name, email, phone number, and address
3. Click Submit to be redirected to a Google Form with your information prefilled

## Connecting to Your Google Form

To connect this form to your actual Google Form:

1. Create a Google Form with fields for name, email, phone, and address
2. Get your Google Form ID from the URL (it's the long string in the URL when editing your form)
3. Find the entry IDs for each field in your Google Form:
   - Go to your Google Form
   - Right-click and select "View page source"
   - Search for "entry." and note the numbers that follow for each field
4. Update the `script.js` file with your Google Form ID and entry IDs

### Example:

If your Google Form URL is:
```
https://docs.google.com/forms/d/e/1FAIpQLSf8XlsK7HyZLF4QZC4DZUFfZ9ZQyZjYOFpfOPI-4BEslB5s8g/viewform
```

Your form ID is: `1FAIpQLSf8XlsK7HyZLF4QZC4DZUFfZ9ZQyZjYOFpfOPI-4BEslB5s8g`

Update the `googleFormBaseUrl` in `script.js` to:
```javascript
const googleFormBaseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf8XlsK7HyZLF4QZC4DZUFfZ9ZQyZjYOFpfOPI-4BEslB5s8g/viewform';
```

Then update the entry IDs in the `prefilledUrl` with the actual entry IDs from your form.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- [Materialize CSS](https://materializecss.com/) - A modern responsive front-end framework based on Material Design
