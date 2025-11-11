// Newsletter subscription functionality

// Handle newsletter subscription
async function handleNewsletterSubscribe(event) {
  event.preventDefault();
  
  const emailInput = document.getElementById('newsletter1');
  const email = emailInput?.value;
  
  if (!email) {
    showToast('Please enter an email address', 'error');
    return;
  }
  
  // Determine source based on current page
  let source = 'home';
  if (window.location.pathname.includes('shop.html')) {
    source = 'shop';
  } else if (window.location.pathname.includes('about.html')) {
    source = 'about';
  } else if (window.location.pathname.includes('contact.html')) {
    source = 'contact';
  }
  
  try {
    const response = await API.subscribeNewsletter(email, source);
    
    if (response.success) {
      // Show success modal
      showNewsletterSuccess();
      
      // Clear input
      if (emailInput) {
        emailInput.value = '';
      }
    }
  } catch (error) {
    if (error.message.includes('already subscribed')) {
      showToast('You are already subscribed!', 'info');
    } else {
      showToast('Subscription failed. Please try again.', 'error');
    }
  }
}

// Show newsletter success modal
function showNewsletterSuccess() {
  const modalHtml = `
    <div class="modal fade" id="newsletterModal" tabindex="-1" aria-labelledby="newsletterModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="newsletterModalLabel">✅ Subscribed!</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Thank you for subscribing to our newsletter! You'll receive the latest recipes and kitchen tips directly in your inbox.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Remove existing modal if present
  const existingModal = document.getElementById('newsletterModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Add new modal
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('newsletterModal'));
  modal.show();
}

// Initialize newsletter forms on page load
document.addEventListener('DOMContentLoaded', () => {
  // Attach to all newsletter buttons
  const newsletterButtons = document.querySelectorAll('[data-bs-target="#newsletterModal"]');
  newsletterButtons.forEach(button => {
    if (!button.dataset.handlerAttached) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        handleNewsletterSubscribe(e);
      });
      button.dataset.handlerAttached = 'true';
    }
  });
});

// Make function available globally
window.handleNewsletterSubscribe = handleNewsletterSubscribe;

