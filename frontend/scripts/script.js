const menuToggle = document.querySelector('.menu-toggle, .mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const apiBaseUrl = window.DC_API_URL || 'http://localhost:3333';
document.querySelectorAll('form[data-api-endpoint]').forEach((form) => form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  const originalText = button?.textContent;
  if (button) { button.disabled = true; button.textContent = 'Enviando...'; }
  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    ['_subject', '_captcha', '_next'].forEach((key) => delete payload[key]);
    const response = await fetch(`${apiBaseUrl}${form.dataset.apiEndpoint}`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Não foi possível enviar o formulário.');
    window.location.href = 'obrigado.html';
  } catch (error) { alert(error.message || 'Erro de conexão com o servidor.'); }
  finally { if (button) { button.disabled = false; button.textContent = originalText; } }
}));

const apiBaseUrl = window.DC_API_URL || 'http://localhost:3333';
document.querySelectorAll('form[data-api-endpoint]').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const originalText = button?.textContent;
    if (button) { button.disabled = true; button.textContent = 'Enviando...'; }
    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      ['_subject', '_captcha', '_next'].forEach((key) => delete payload[key]);
      const response = await fetch(`${apiBaseUrl}${form.dataset.apiEndpoint}`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Não foi possível enviar o formulário.');
      window.location.href = 'obrigado.html';
    } catch (error) {
      alert(error.message || 'Erro de conexão com o servidor.');
    } finally {
      if (button) { button.disabled = false; button.textContent = originalText; }
    }
  });
});
