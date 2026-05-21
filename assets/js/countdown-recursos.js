/* ============================================================
   AChETIQ — Componente: Cuenta regresiva de Recursos Académicos
   Archivo: assets/js/countdown-recursos.js
   ------------------------------------------------------------
   Comportamiento:
   - Lee la fecha objetivo del atributo [data-target-date] (ISO 8601)
     sobre el contenedor [data-countdown].
   - Actualiza días / horas / minutos / segundos cada 1 s.
   - Al expirar: oculta el bloque .countdown__pending y revela el
     contenido marcado con [data-countdown-revealed], emitiendo el
     evento personalizado "countdown:revealed".
   - Soporta múltiples instancias por página (cada [data-countdown]
     se inicializa de forma independiente).
   ------------------------------------------------------------
   Sin dependencias externas. JavaScript vanilla.
   ============================================================ */

(function () {
  "use strict";

  var MS_SECOND = 1000;
  var MS_MINUTE = MS_SECOND * 60;
  var MS_HOUR = MS_MINUTE * 60;
  var MS_DAY = MS_HOUR * 24;

  /**
   * Devuelve el desglose de tiempo restante hasta la fecha objetivo.
   * @param {number} targetMs - epoch de la fecha objetivo en ms.
   * @returns {{total:number, days:number, hours:number, minutes:number, seconds:number}}
   */
  function getTimeLeft(targetMs) {
    var diff = targetMs - Date.now();

    if (diff <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      total: diff,
      days: Math.floor(diff / MS_DAY),
      hours: Math.floor((diff % MS_DAY) / MS_HOUR),
      minutes: Math.floor((diff % MS_HOUR) / MS_MINUTE),
      seconds: Math.floor((diff % MS_MINUTE) / MS_SECOND)
    };
  }

  /**
   * Escribe un valor en un dígito, con animación de cambio si difiere.
   * @param {HTMLElement} el - elemento [data-unit].
   * @param {number} value - valor numérico actual.
   */
  function setDigit(el, value) {
    if (!el) return;
    var text = String(value).padStart(2, "0");
    if (el.textContent === text) return;

    el.textContent = text;
    el.classList.remove("is-ticking");
    // Reinicia la animación de entrada.
    void el.offsetWidth; // reflow
    el.classList.add("is-ticking");
  }

  /**
   * Inicializa una instancia del contador.
   * @param {HTMLElement} root - contenedor [data-countdown].
   */
  function initCountdown(root) {
    var rawDate = root.getAttribute("data-target-date");
    if (!rawDate) {
      console.warn("[countdown] Falta el atributo data-target-date.", root);
      return;
    }

    var targetMs = new Date(rawDate).getTime();
    if (isNaN(targetMs)) {
      console.warn("[countdown] data-target-date no es una fecha válida:", rawDate);
      return;
    }

    var pending = root.querySelector("[data-countdown-pending]");
    var revealed = root.querySelector("[data-countdown-revealed]");

    var units = {
      days: root.querySelector('[data-unit="days"]'),
      hours: root.querySelector('[data-unit="hours"]'),
      minutes: root.querySelector('[data-unit="minutes"]'),
      seconds: root.querySelector('[data-unit="seconds"]')
    };

    var intervalId = null;
    var revealedDone = false;

    function reveal() {
      if (revealedDone) return;
      revealedDone = true;

      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }

      if (pending) pending.setAttribute("hidden", "");
      if (revealed) revealed.removeAttribute("hidden");

      root.setAttribute("data-countdown-state", "revealed");
      root.dispatchEvent(
        new CustomEvent("countdown:revealed", { bubbles: true })
      );
    }

    function render() {
      var t = getTimeLeft(targetMs);

      setDigit(units.days, t.days);
      setDigit(units.hours, t.hours);
      setDigit(units.minutes, t.minutes);
      setDigit(units.seconds, t.seconds);

      if (t.total <= 0) reveal();
    }

    // Estado inicial: si ya expiró, revelar sin mostrar el contador.
    if (getTimeLeft(targetMs).total <= 0) {
      reveal();
      return;
    }

    root.setAttribute("data-countdown-state", "pending");
    if (revealed && !revealed.hasAttribute("hidden")) {
      revealed.setAttribute("hidden", "");
    }

    render();
    intervalId = setInterval(render, MS_SECOND);
  }

  function initAll() {
    var nodes = document.querySelectorAll("[data-countdown]");
    for (var i = 0; i < nodes.length; i++) {
      initCountdown(nodes[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
