document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loops-form');
  const submitBtn = document.getElementById('loops-submit-btn');
  const messageDiv = document.getElementById('form-message');

  if (form && submitBtn && messageDiv) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
      messageDiv.style.display = 'none';

      // Safely extract values to prevent crashes if a field is missing
      const firstName = form.querySelector('[name="firstName"]')?.value || '';
      const lastName = form.querySelector('[name="lastName"]')?.value || '';
      const email = form.querySelector('[name="email"]')?.value || '';
      const mailingLists = form.querySelector('[name="mailingLists"]')?.value || '';

      const formBody = new URLSearchParams();
      if (firstName) formBody.append('firstName', firstName);
      if (lastName) formBody.append('lastName', lastName);
      formBody.append('email', email);
      if (mailingLists) formBody.append('mailingLists', mailingLists);

      try {
        // Ensure YOUR_FORM_ID is replaced with your actual Loops ID
        const response = await fetch('https://app.loops.so/api/newsletter-form/cmwdzg3q102em0jyryw1qpw77', {
          method: 'POST',
          body: formBody.toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const data = await response.json();

        if (response.status === 429) {
          messageDiv.textContent = 'Demasiados intentos. Por favor, espera un minuto.';
          messageDiv.style.color = '#d66d4d';
        } else if (data.success) {
          messageDiv.textContent = '¡Éxito! Revisa tu correo para confirmar y descargar tu guía.';
          messageDiv.style.color = '#668541';
          form.reset();
        } else {
          messageDiv.textContent = data.message || 'Ocurrió un error. Por favor, inténtalo de nuevo.';
          messageDiv.style.color = '#d66d4d';
        }
      } catch (error) {
        messageDiv.textContent = 'Ocurrió un error de red. Inténtalo de nuevo.';
        messageDiv.style.color = '#d66d4d';
      } finally {
        messageDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
});