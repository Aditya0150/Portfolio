// Native fetch is available in Node.js 18+

const DEPLOYED_URL = process.argv[2];

if (!DEPLOYED_URL) {
    console.error('Please provide your deployed backend URL as an argument.');
    console.error('Usage: node verify-deployment.js <YOUR_BACKEND_URL>');
    console.error('Example: node verify-deployment.js https://my-app.onrender.com');
    process.exit(1);
}

// Remove trailing slash if present
const baseUrl = DEPLOYED_URL.replace(/\/$/, '');

async function checkEndpoint(name, path, expectedStatus = 200) {
    try {
        const url = `${baseUrl}${path}`;
        console.log(`Checking ${name} (${url})...`);
        const response = await fetch(url);

        if (response.status === expectedStatus) {
            console.log(`✅ ${name} is UP (Status: ${response.status})`);
            return true;
        } else {
            console.error(`❌ ${name} returned status ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ ${name} failed: ${error.message}`);
        return false;
    }
}

async function verify() {
    console.log(`Starting verification for: ${baseUrl}\n`);

    const healthCheck = await checkEndpoint('Health Check', '/');
    const projectsCheck = await checkEndpoint('Projects API', '/api/projects');
    const visitorsCheck = await checkEndpoint('Visitors API', '/api/visitors');

    console.log('\n--- Verification Summary ---');
    if (healthCheck && projectsCheck && visitorsCheck) {
        console.log('🎉 Backend appears to be running correctly!');
    } else {
        console.log('⚠️  Some checks failed. Please check your deployment logs.');
    }
}

verify();
