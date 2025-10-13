let stream = null;
let capturedImage = null;

// Open file picker
function openFilePicker() {
    document.getElementById('profile').click();
}

// Open camera modal
function openCamera() {
    const modal = document.getElementById('cameraModal');
    modal.style.display = 'block';
    startCamera();
}

// Close modal
function closeModal() {
    const modal = document.getElementById('cameraModal');
    modal.style.display = 'none';
    stopCamera();
    resetCameraUI();
}

// Start camera
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }, 
            audio: false 
        });
        
        const video = document.getElementById('video');
        video.srcObject = stream;
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please check permissions and try again.');
        closeModal();
    }
}

// Stop camera
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

// Capture photo
function capturePhoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to data URL
    capturedImage = canvas.toDataURL('image/jpeg', 0.8);
    
    // Show captured image and controls
    video.style.display = 'none';
    canvas.style.display = 'block';
    
    document.getElementById('captureBtn').style.display = 'none';
    document.getElementById('retakeBtn').style.display = 'inline-block';
    document.getElementById('usePhotoBtn').style.display = 'inline-block';
}

// Retake photo
function retakePhoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    
    video.style.display = 'block';
    canvas.style.display = 'none';
    
    document.getElementById('captureBtn').style.display = 'inline-block';
    document.getElementById('retakeBtn').style.display = 'none';
    document.getElementById('usePhotoBtn').style.display = 'none';
    
    capturedImage = null;
}

// Use captured photo
function usePhoto() {
    if (!capturedImage) {
        alert('No photo captured!');
        return;
    }
    
    // Convert data URL to blob and create file
    fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
            const file = new File([blob], `camera-photo-${Date.now()}.jpg`, { 
                type: 'image/jpeg' 
            });
            
            // Create a new FormData and append the file
            const formData = new FormData();
            formData.append('profile', file);
            
            // Submit the form
            fetch('/account/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Error uploading photo. Please try again.');
                }
            })
            .catch(error => {
                console.error('Upload error:', error);
                alert('Error uploading photo. Please try again.');
            });
        });
    
    closeModal();
}

// Reset camera UI
function resetCameraUI() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    
    video.style.display = 'block';
    canvas.style.display = 'none';
    
    document.getElementById('captureBtn').style.display = 'inline-block';
    document.getElementById('retakeBtn').style.display = 'none';
    document.getElementById('usePhotoBtn').style.display = 'none';
    
    capturedImage = null;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // File input change
    document.getElementById('profile').addEventListener('change', function() {
        if (this.files.length > 0) {
            document.getElementById('uploadForm').submit();
        }
    });
    
    // Modal close events
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('cameraModal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Camera control events
    document.getElementById('captureBtn').addEventListener('click', capturePhoto);
    document.getElementById('retakeBtn').addEventListener('click', retakePhoto);
    document.getElementById('usePhotoBtn').addEventListener('click', usePhoto);
    
    // Escape key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});

// Fallback for browsers without camera support
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    document.querySelector('.option-card:nth-child(2)').style.opacity = '0.5';
    document.querySelector('.option-card:nth-child(2)').style.cursor = 'not-allowed';
    document.querySelector('.option-card:nth-child(2)').onclick = null;
    document.querySelector('.option-card:nth-child(2) p').textContent = 'Camera not supported in this browser';
}