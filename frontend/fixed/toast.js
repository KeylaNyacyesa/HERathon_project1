// Toast Notification System
function showToast(message, type = 'info', duration = 4000) {
  // Create container if it doesn't exist
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const messageSpan = document.createElement('span');
  messageSpan.className = 'toast-message';
  messageSpan.textContent = message;
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.textContent = '×';
  closeBtn.onclick = () => removeToast(toast);
  
  toast.appendChild(messageSpan);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  // Auto remove after duration
  if (duration > 0) {
    setTimeout(() => removeToast(toast), duration);
  }

  return toast;
}

function removeToast(toast) {
  toast.classList.add('removing');
  setTimeout(() => {
    toast.remove();
  }, 300);
}

function showSuccess(message, duration = 4000) {
  return showToast(message, 'success', duration);
}

function showError(message, duration = 4000) {
  return showToast(message, 'error', duration);
}

function showWarning(message, duration = 4000) {
  return showToast(message, 'warning', duration);
}

function showInfo(message, duration = 4000) {
  return showToast(message, 'info', duration);
}
