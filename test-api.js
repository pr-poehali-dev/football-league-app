// Test WMFL API Sync
const url = 'https://functions.poehali.dev/9ac10abe-a2aa-49ea-9f85-c0d89d2bb5a7';

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({})
})
  .then(async response => {
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    console.log('\nResponse Body:');
    const text = await response.text();
    try {
      const json = JSON.parse(text);
      console.log(JSON.stringify(json, null, 2));
    } catch {
      console.log(text);
    }
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
