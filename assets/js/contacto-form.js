/* ============================================================
   AChETIQ — Patrón accesible del formulario de contacto
   (contacto-form.js)
   ------------------------------------------------------------
   Versión: 1.0 · Fase S4 — Accesibilidad WCAG 2.2 AA
   Fundamento: FASE_1 §6 (Formularios) · forms.css

   SIN BACKEND. El sitio es estático: al validar correctamente,
   el envío compone un mailto: hacia el correo institucional
   (data/redes.json, mismo origen de datos que las tarjetas de
   canales) y lo abre en el cliente de correo de la persona.

   PATRÓN DE ERRORES (WCAG 3.3.1 / 3.3.3 / 4.1.3)
     - Validación al enviar (novalidate en el <form>): no se
       interrumpe a la persona mientras escribe; al salir de un
       campo ya corregido, su error se limpia.
     - Cada campo tiene su <p class="form__error"> PRE-EXISTENTE
       en el markup (vacío + hidden) y referenciado por
       aria-describedby: la asociación ya existe cuando el error
       aparece, y el lector la verbaliza al focalizar el campo.
     - aria-invalid="true" se aplica solo a los campos con error
       (forms.css pinta el borde; el mensaje y el glifo dan la
       señal no cromática).
     - Resumen de errores role="alert" + tabindex="-1" al tope:
       recibe el foco tras un envío inválido y enumera cada error
       como enlace al campo correspondiente.

   Sin dependencias. ES module nativo, sin transpilación.
   ============================================================ */

'use strict';

const BASE = window.AChETIQBase || {
  root: '/',
  resolve: (p) => '/' + String(p).replace(/^(\.?\/)+/, '')
};

/* Mismo criterio laxo que la validación type="email" nativa:
   algo@algo.algo, sin espacios. No se pretende RFC 5322. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MENSAJES = {
  nombre:  'Ingresá tu nombre y apellido.',
  email:   'Ingresá tu correo electrónico.',
  emailFormato: 'Revisá el formato del correo (ej.: nombre@dominio.com).',
  mensaje: 'Escribí el mensaje que querés enviarnos.'
};

let emailInstitucional = null;

function init() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const summary     = form.querySelector('.form__error-summary');
  const summaryList = form.querySelector('.form__error-summary-list');
  const status      = form.querySelector('.form__status');

  const fields = {
    nombre:  form.querySelector('#contacto-nombre'),
    email:   form.querySelector('#contacto-email'),
    mensaje: form.querySelector('#contacto-mensaje')
  };
  if (!summary || !summaryList || !status ||
      !fields.nombre || !fields.email || !fields.mensaje) return;

  /* El correo destino se lee del mismo JSON que alimenta las
     tarjetas de canales. Se resuelve en segundo plano; si falla,
     el envío informa el canal directo como alternativa. */
  fetch(BASE.resolve('data/redes.json'), { credentials: 'same-origin' })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && typeof data.email === 'string') emailInstitucional = data.email;
    })
    .catch(() => { /* sin red: se informa al enviar. */ });

  function validate(name) {
    const input = fields[name];
    const value = input.value.trim();
    if (!value) return MENSAJES[name];
    if (name === 'email' && !EMAIL_RE.test(value)) return MENSAJES.emailFormato;
    return null;
  }

  function setFieldError(name, message) {
    const input = fields[name];
    const errorNode = document.getElementById(input.id + '-error');
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      errorNode.textContent = message;
      errorNode.hidden = false;
    } else {
      input.removeAttribute('aria-invalid');
      errorNode.textContent = '';
      errorNode.hidden = true;
    }
  }

  /* Limpieza al salir del campo: solo si el campo estaba marcado
     y ya es válido (no se valida agresivamente mientras escribe). */
  Object.keys(fields).forEach((name) => {
    fields[name].addEventListener('blur', () => {
      if (fields[name].getAttribute('aria-invalid') === 'true' && !validate(name)) {
        setFieldError(name, null);
      }
    });
  });

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    status.textContent = '';

    const errores = [];
    Object.keys(fields).forEach((name) => {
      const message = validate(name);
      setFieldError(name, message);
      if (message) errores.push({ name, message });
    });

    if (errores.length) {
      summaryList.replaceChildren();
      errores.forEach(({ name, message }) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('href', '#' + fields[name].id);
        a.textContent = message;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          fields[name].focus();
        });
        li.appendChild(a);
        summaryList.appendChild(li);
      });
      summary.hidden = false;
      summary.focus();
      return;
    }

    summary.hidden = true;

    if (!emailInstitucional) {
      status.textContent =
        'No pudimos preparar el envío. Escribinos directamente por el ' +
        'correo institucional que figura en los canales directos.';
      return;
    }

    const asunto = 'Consulta desde el sitio de AChETIQ';
    const cuerpo =
      'Nombre: ' + fields.nombre.value.trim() + '\n' +
      'Correo: ' + fields.email.value.trim() + '\n\n' +
      fields.mensaje.value.trim();
    window.location.href = 'mailto:' + emailInstitucional +
      '?subject=' + encodeURIComponent(asunto) +
      '&body=' + encodeURIComponent(cuerpo);

    status.textContent =
      'Abrimos tu aplicación de correo con el mensaje listo para enviar. ' +
      'Si no se abrió, escribinos al correo institucional de los canales directos.';
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
