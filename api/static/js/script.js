const uploadForm = document.getElementById('uploadForm');
const uploadMessage = document.getElementById('uploadMessage');
const rankBtn = document.getElementById('rankBtn');
const resultTableBody = document.querySelector('#resultTable tbody');

// Get CSRF token from the form
function getCSRFToken() {
    const tokenInput = document.querySelector('[name=csrfmiddlewaretoken]');
    return tokenInput ? tokenInput.value : '';
}

// Upload Resume
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('resume', document.getElementById('resumeFile').files[0]);
    formData.append('csrfmiddlewaretoken', getCSRFToken());

    try {
        const res = await fetch('/api/upload/', {
            method: 'POST',
            body: formData
        });

        // Check if response is JSON
        const contentType = res.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await res.json();
        } else {
            const text = await res.text();
            throw new Error(text || 'Upload failed with non-JSON response');
        }

        if (!res.ok) {
            throw new Error(data.error || 'Upload failed');
        }

        uploadMessage.textContent = `Resume uploaded successfully for ${data.name}`;
        uploadMessage.style.color = 'green';
        uploadForm.reset();
    } catch (err) {
        uploadMessage.textContent = `Upload failed: ${err.message}`;
        uploadMessage.style.color = 'red';
        console.error(err);
    }
});

// Rank Candidates
rankBtn.addEventListener('click', async () => {
    const jobDesc = document.getElementById('jobDesc').value;

    try {
        const res = await fetch('/api/rank/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({ job_description: jobDesc })
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText || 'Failed to rank candidates');
        }

        const candidates = await res.json();
        resultTableBody.innerHTML = '';
        candidates.forEach(c => {
            const row = `<tr>
                            <td>${c.name}</td>
                            <td>${c.email}</td>
                            <td>${c.skills}</td>
                            <td>${c.score.toFixed(2)}</td>
                         </tr>`;
            resultTableBody.innerHTML += row;
        });
    } catch (err) {
        alert(`Error ranking candidates: ${err.message}`);
        console.error(err);
    }
});
