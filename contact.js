(function(){
  const openBtn = document.getElementById('contact-open');
  const modal = document.getElementById('contact-modal');
  const overlay = modal && modal.querySelector('.modal__overlay');
  const closeBtn = modal && modal.querySelector('.modal__close');
  const cancelBtn = modal && modal.querySelector('.modal__cancel');
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const errorsEl = modal && modal.querySelector('.form__errors');
  const submitBtn = form && form.querySelector('button[type="submit"]');
  let lastFocused = null;

  if (!openBtn || !modal || !form || !submitBtn) return;

  // start disabled until validation passes
  submitBtn.disabled = true;
  submitBtn.setAttribute('aria-disabled', 'true');

  function openModal() {
    lastFocused = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    nameInput.focus();
    document.documentElement.style.overflow = 'hidden';
    updateSubmitState();
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    if (lastFocused) lastFocused.focus();
    clearErrors();
    form.reset();
    updateSubmitState();
  }

  function clearErrors() {
    errorsEl.textContent = '';
  }

  function showErrors(messages) {
    errorsEl.innerHTML = messages.map(m => `<div class="error-item">${m}</div>`).join('');
  }

  function validate() {
    const errors = [];
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name) errors.push('Please enter your name.');
    if (!email) errors.push('Please enter your email.');
    else {
      // simple email regex
      const re = /^\S+@\S+\.\S+$/;
      if (!re.test(email)) errors.push('Please enter a valid email address.');
    }
    if (!message) errors.push('Please add a short message.');

    return { valid: errors.length === 0, errors, data: { name, email, message } };
  }

  // Lightweight validity check used while typing (no messages)
  function isFormValid() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    const re = /^\S+@\S+\.\S+$/;
    return name.length > 0 && re.test(email) && message.length > 0;
  }

  function updateSubmitState() {
    const valid = isFormValid();
    submitBtn.disabled = !valid;
    if (valid) submitBtn.removeAttribute('aria-disabled');
    else submitBtn.setAttribute('aria-disabled', 'true');
  }

  function onSubmit(e) {
    e.preventDefault();

    const { valid, errors, data } = validate();
    if (!valid) {
      showErrors(errors);
      updateSubmitState();
      return;
    }

    // Build mailto as fallback for no-backend environment
    const to = 'rebekahmiller18@gmail.com';
    const subject = encodeURIComponent(`Website contact from ${data.name}`);
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`);
    const mailto = `mailto:${to}?subject=${subject}&body=${body}`;

    // open mail client in a new navigation
    window.location.href = mailto;

    // close modal and show brief success (form reset will be handled on close)
    closeModal();
  }

  // live validation while typing
  [nameInput, emailInput, messageInput].forEach(el => {
    el.addEventListener('input', () => {
      clearErrors();
      updateSubmitState();
    });
  });

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  form.addEventListener('submit', onSubmit);

  // ensure correct initial state
  updateSubmitState();
})();