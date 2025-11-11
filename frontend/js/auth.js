// Authentication functionality

// Handle login form submission
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const response = await API.login(email, password);
    
    if (response.success) {
      // Close modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
      modal.hide();
      
      // Show success message
      showToast('Successfully logged in!', 'success');
      
      // Update UI based on auth status
      updateAuthUI(response.user);
      
      // Redirect to home if needed
      if (window.location.pathname.includes('home.html')) {
        location.reload();
      }
    }
  } catch (error) {
    showToast(error.message || 'Login failed. Please check your credentials.', 'error');
  }
}

// Handle signup form submission
async function handleSignup(event) {
  event.preventDefault();
  
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  
  // Validate passwords match
  if (password !== confirmPassword) {
    showToast('Passwords do not match!', 'error');
    return;
  }
  
  try {
    const response = await API.register({
      email,
      password,
      name: email.split('@')[0], // Use email username as default name
    });
    
    if (response.success) {
      // Close modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
      modal.hide();
      
      // Show success message
      showToast('Account created successfully! You are now logged in.', 'success');
      
      // Update UI
      updateAuthUI(response.user);
      
      // Redirect if needed
      if (!window.location.pathname.includes('home.html')) {
        window.location.href = 'home.html';
      } else {
        location.reload();
      }
    }
  } catch (error) {
    showToast(error.message || 'Signup failed. Please try again.', 'error');
  }
}

// Update UI based on auth status
function updateAuthUI(user) {
  // Update navigation to show user info
  const loginBtn = document.querySelector('.btn-outline-warning');
  const signupBtn = document.querySelector('.btn-outline-light');
  
  if (loginBtn && signupBtn) {
    loginBtn.innerHTML = `<i class="bi bi-person-circle me-2"></i>${user.name}`;
    signupBtn.innerHTML = '<i class="bi bi-box-arrow-right me-2"></i>Logout';
    
    // Add logout handler
    signupBtn.onclick = () => API.logout();
  }
}

// Check auth status on page load
async function checkAuthStatus() {
  const token = API.getToken();
  
  if (token) {
    try {
      const response = await API.getCurrentUser();
      if (response.success) {
        updateAuthUI(response.data);
      }
    } catch (error) {
      // Token invalid, clear it
      API.removeToken();
    }
  }
}

// Show toast notification
function showToast(message, type = 'info') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
  toast.style.zIndex = '9999';
  toast.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  document.body.appendChild(toast);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  
  // Attach form handlers - use form IDs if available, otherwise find by modal
  const loginForm = document.getElementById('loginForm') || document.getElementById('loginModal')?.querySelector('form');
  const signupForm = document.getElementById('signupForm') || document.getElementById('signupModal')?.querySelector('form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  } else {
    console.warn('Login form not found');
  }
  
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  } else {
    console.warn('Signup form not found');
  }
});

// Make functions available globally
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.checkAuthStatus = checkAuthStatus;

