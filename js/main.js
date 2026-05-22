document.addEventListener('DOMContentLoaded', () => {
  // 1. PRELOADER Y ANIMACIÓN DE ENTRADA (GSAP)
  const runPreloader = () => {
    const preloader = document.getElementById('preloader');
    const fill = document.querySelector('.preloader-progress-fill');
    const progressValue = document.querySelector('.preloader-progress-value');
    const title = document.querySelector('.preloader-text');
    const tagline = document.querySelector('.preloader-tagline');
    const logo = document.querySelector('.preloader-logo-shell');
    const statusCards = document.querySelectorAll('.preloader-status-card');
    const progressUI = document.querySelectorAll('.preloader-progress-bar, .preloader-progress-meta');
    const orbits = document.querySelectorAll('.preloader-orbit');
    
    if (!preloader) return;

    gsap.set([title, tagline, ...progressUI], { opacity: 0, y: 16 });
    gsap.set(statusCards, { opacity: 0, y: 22 });
    gsap.set(orbits, { opacity: 0, scale: 0.96 });

    // Animación de barra de progreso ficticia
    let progress = 0;
    const interval = setInterval(() => {
      progress += 7 + Math.random() * 11;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Iniciar transiciones de textos del logo con GSAP
        const tl = gsap.timeline();
        
        tl.fromTo(logo, { opacity: 0.18, scale: 0.82, rotate: -10 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'power3.out' })
          .to(orbits, { opacity: 1, scale: 1, duration: 0.65, stagger: 0.08, ease: 'power2.out' }, '-=0.45')
          .to(title, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.25')
          .to(tagline, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.18')
          .to(statusCards, { opacity: 1, y: 0, stagger: 0.08, duration: 0.45, ease: 'power2.out' }, '-=0.05')
          .to(progressUI, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.15')
          .to(preloader, { 
            opacity: 0,
            scale: 1.04,
            duration: 0.7,
            delay: 0.35,
            ease: 'power4.inOut',
            onComplete: () => {
              preloader.style.display = 'none';
              document.body.classList.add('page-loaded');
              // Activar animaciones del Hero una vez se retire el preloader
              runHeroAnimations();
            } 
          });
      }
      if (fill) fill.style.width = `${progress}%`;
      if (progressValue) progressValue.textContent = `${String(Math.round(progress)).padStart(2, '0')}%`;
    }, 80);
  };

  // 2. ANIMACIONES DEL HERO (Una vez se quita el preloader)
  const runHeroAnimations = () => {
    const tl = gsap.timeline();
    
    tl.from('.glass-navbar', { opacity: 0, y: -18, duration: 0.55, ease: 'power2.out' })
      .from('.hero-gradient-mesh, .hero-grid-overlay', { opacity: 0, scale: 1.04, duration: 1.1, ease: 'power2.out' }, '-=0.32')
      .from('.hero-badge', { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' }, '-=0.5')
      .from('.hero-title span', { opacity: 0, y: 30, stagger: 0.2, duration: 0.8, ease: 'power3.out' }, '-=0.3')
      .from('.hero-desc', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .from('.hero-ctas', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .from('.hero-proof-row > div', { opacity: 0, y: 18, stagger: 0.08, duration: 0.5, ease: 'power2.out' }, '-=0.35')
      .from('.hero-main-card', { opacity: 0, scale: 0.88, rotate: -2, duration: 0.9, ease: 'power3.out' }, '-=0.65')
      .from('.floating-chip', { opacity: 0, y: 18, stagger: 0.1, duration: 0.5, ease: 'back.out(1.4)' }, '-=0.35')
      .from('.dossier-card', { opacity: 0, x: 35, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .from('.hero-image-tile', { opacity: 0, x: -35, duration: 0.7, ease: 'power3.out' }, '-=0.5');
  };

  const setupRevealFallback = () => {
    const revealTargets = document.querySelectorAll('.reveal-up, .service-card-anim, .gallery-panel, .process-step');

    if (!('IntersectionObserver' in window)) {
      revealTargets.forEach(target => target.classList.add('in-view'));
      return;
    }

    revealTargets.forEach(target => target.classList.add('fallback-reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    revealTargets.forEach(target => observer.observe(target));
  };

  // Ejecutar el preloader
  if (typeof gsap !== 'undefined') {
    runPreloader();
  } else {
    // Si GSAP no carga por alguna razón, ocultar preloader
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.style.display = 'none';
    document.body.classList.add('page-loaded');
  }

  // 3. EFECTOS DE DESPLAZAMIENTO (GSAP ScrollTrigger)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Revelar secciones y tarjetas
    gsap.utils.toArray('.reveal-up').forEach((elem) => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // Animación de tarjetas de servicio secuencial
    gsap.from('.service-card-anim', {
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 80%',
      },
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.utils.toArray('.gallery-panel').forEach((panel, index) => {
      gsap.from(panel, {
        scrollTrigger: {
          trigger: panel,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 42,
        rotate: index % 2 === 0 ? -1.5 : 1.5,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    gsap.utils.toArray('.process-step').forEach((step, index) => {
      gsap.from(step, {
        scrollTrigger: {
          trigger: step,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 24,
        delay: index * 0.05,
        duration: 0.55,
        ease: 'power2.out'
      });
    });

    // Contadores de la sección métricas
    gsap.utils.toArray('.metric-number').forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      gsap.fromTo(counter, 
        { textContent: 0 }, 
        { 
          textContent: target,
          duration: 2,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: counter,
            start: 'top 90%',
          },
          snap: { textContent: 1 },
          onUpdate: function() {
            // Dar formato a los números (añadir el signo + o % si es necesario)
            const suffix = counter.getAttribute('data-suffix') || '';
            counter.innerHTML = Math.ceil(this.targets()[0].textContent) + suffix;
          }
        }
      );
    });
  } else {
    setupRevealFallback();
  }

  // 4. MICROINTERACCIONES VISUALES
  document.querySelectorAll('[data-spotlight]').forEach((spotlightSection) => {
    const spotlight = spotlightSection.querySelector('.hero-spotlight');
    if (!spotlight) return;

    spotlightSection.addEventListener('pointermove', (event) => {
      const rect = spotlightSection.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      spotlight.style.setProperty('--mx', `${x}%`);
      spotlight.style.setProperty('--my', `${y}%`);
    });
  });

  const tiltCards = document.querySelectorAll('.service-card');

  tiltCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (window.innerWidth < 900) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 7;
      const rotateX = ((y / rect.height) - 0.5) * -7;
      card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  // 5. LÓGICA DEL SIMULADOR TRIBUTARIO / DIAGNÓSTICO
  const simulatorData = {
    perfil: '',
    ingresos: '',
    desafio: ''
  };

  const simSteps = document.querySelectorAll('.sim-step');
  const nextBtns = document.querySelectorAll('.sim-next-btn');
  const prevBtns = document.querySelectorAll('.sim-prev-btn');
  const progressNodes = document.querySelectorAll('.sim-progress-node');
  const optionCards = document.querySelectorAll('.sim-option-card');

  // Selección de opción en el simulador
  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      const stepName = card.getAttribute('data-step');
      const value = card.getAttribute('data-value');
      
      // Deseleccionar hermanos en el mismo paso
      const stepContainer = card.closest('.sim-step');
      stepContainer.querySelectorAll('.sim-option-card').forEach(c => c.classList.remove('selected'));
      
      card.classList.add('selected');
      simulatorData[stepName] = value;

      // Habilitar botón Siguiente de ese paso
      const nextBtn = stepContainer.querySelector('.sim-next-btn');
      if (nextBtn) nextBtn.removeAttribute('disabled');
    });
  });

  // Navegación Siguiente
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStepIdx = parseInt(btn.getAttribute('data-current'), 10);
      const nextStepIdx = currentStepIdx + 1;
      
      if (nextStepIdx === 4) {
        calcularYMostrarResultado();
      }
      
      goToStep(nextStepIdx);
    });
  });

  // Navegación Anterior
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStepIdx = parseInt(btn.getAttribute('data-current'), 10);
      const prevStepIdx = currentStepIdx - 1;
      goToStep(prevStepIdx);
    });
  });

  const goToStep = (stepIdx) => {
    simSteps.forEach((step, idx) => {
      if (idx + 1 === stepIdx) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Actualizar nodos de progreso visual
    progressNodes.forEach((node, idx) => {
      const nodeIdx = idx + 1;
      node.classList.remove('active', 'completed');
      if (nodeIdx === stepIdx) {
        node.classList.add('active');
      } else if (nodeIdx < stepIdx) {
        node.classList.add('completed');
        node.innerHTML = '✓';
      } else {
        node.innerHTML = nodeIdx;
      }
    });
  };

  const calcularYMostrarResultado = () => {
    const resultTitle = document.getElementById('sim-result-title');
    const resultDesc = document.getElementById('sim-result-desc');
    const resultActions = document.getElementById('sim-result-actions');
    
    let title = '';
    let description = '';
    let actionsHtml = '';

    const { perfil, ingresos, desafio } = simulatorData;

    // Lógica para determinar el plan sugerido
    if (perfil === 'extranjero') {
      title = 'Estructuración y Establecimiento de Capital Extranjero';
      description = 'Su empresa requiere una estructuración jurídica internacional robusta en el Ecuador. Recomendamos un análisis de sucursal extranjera vs. constitución local SAS, acompañado de representación legal tributaria ante el SRI y registros municipales.';
      actionsHtml = `
        <li class="flex items-start gap-2 mb-2">
          <span class="text-amber-500 font-bold">✓</span>
          <span>Análisis comparativo de figura societaria (Sucursal vs Cía. Limitada/S.A.)</span>
        </li>
        <li class="flex items-start gap-2 mb-2">
          <span class="text-amber-500 font-bold">✓</span>
          <span>Planificación fiscal internacional para evitar doble imposición</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-amber-500 font-bold">✓</span>
          <span>Representación legal corporativa y obtención de RUC local</span>
        </li>`;
    } else if (ingresos === 'gran' || desafio === 'defensa') {
      title = 'Planificación Fiscal Avanzada y Defensa Tributaria';
      description = 'Dado el volumen de ingresos o el riesgo tributario, su prioridad es blindar sus operaciones frente al SRI. Proponemos un diagnóstico fiscal preventivo para identificar deducciones subutilizadas y mitigar riesgos de auditoría.';
      actionsHtml = `
        <li class="flex items-start gap-2 mb-2">
          <span class="text-amber-500 font-bold">✓</span>
          <span>Defensa en glosas y requerimientos administrativos ante el SRI</span>
        </li>
        <li class="flex items-start gap-2 mb-2">
          <span class="text-amber-500 font-bold">✓</span>
          <span>Diagnóstico de auditoría tributaria simulada</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-amber-500 font-bold">✓</span>
          <span>Optimización legal de la tasa efectiva de impuesto a la renta</span>
        </li>`;
    } else if (perfil === 'empresa' && (ingresos === 'mediano' || ingresos === 'pequeno')) {
      title = 'Asesoría Integral Corporativa y Contable Pyme';
      description = 'Su estructura corporativa requiere orden mensual, cumplimiento legal estricto y optimización de costos. Este plan cubre todas sus declaraciones, la contabilidad bajo NIIF y la revisión de contratos de personal.';
      actionsHtml = `
        <li class="flex items-start gap-2 mb-2">
          <span class="text-amber-500 font-bold">✓</span>
          <span>Contabilidad completa, declaraciones SRI e informes societarios (Supercias)</span>
        </li>
        <li class="flex items-start gap-2 mb-2">
          <span class="text-amber-500 font-bold">✓</span>
          <span>Asesoría laboral continua y administración de nómina (IESS y MDT)</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-amber-500 font-bold">✓</span>
          <span>Consultas legales corporativas ilimitadas</span>
        </li>`;
    } else {
      // Profesionales / Personas naturales
      title = 'Consultoría Fiscal y Contable Personalizada';
      description = 'Para profesionales independientes y personas naturales, nos enfocamos en simplificar sus obligaciones RIMPE o Régimen General, maximizando sus gastos deducibles personales y asegurando sus devoluciones de IVA/Retenciones.';
      actionsHtml = `
        <li class="flex items-start gap-2 mb-2">
          <span class="text-amber-500 font-bold">✓</span>
          <span>Declaraciones de IVA e Impuesto a la Renta Personas Naturales</span>
        </li>
        <li class="flex items-start gap-2 mb-2">
          <span class="text-amber-500 font-bold">✓</span>
          <span>Procesos de devolución de impuestos (IVA Tercera Edad, Retenciones)</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-amber-500 font-bold">✓</span>
          <span>Estructura de gastos deducibles bajo nueva normativa legal</span>
        </li>`;
    }

    if (resultTitle) resultTitle.innerText = title;
    if (resultDesc) resultDesc.innerText = description;
    if (resultActions) resultActions.innerHTML = actionsHtml;

    // Rellenar automáticamente un campo oculto o preseleccionar en el formulario de contacto
    const interestField = document.getElementById('contact-interest');
    if (interestField) {
      interestField.value = `Diagnóstico: ${title}`;
    }
  };

  // Botón Reiniciar Simulador
  const resetBtn = document.getElementById('sim-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Limpiar datos
      simulatorData.perfil = '';
      simulatorData.ingresos = '';
      simulatorData.desafio = '';
      
      // Limpiar selección visual
      optionCards.forEach(c => c.classList.remove('selected'));
      
      // Desactivar botones siguiente
      nextBtns.forEach(btn => btn.setAttribute('disabled', 'true'));
      
      // Ir al paso 1
      goToStep(1);
    });
  }

  // 6. VALIDACIÓN DEL FORMULARIO DE CONTACTO / AGENDAMIENTO
  const contactForm = document.getElementById('alianza-contact-form');
  const alertContainer = document.getElementById('form-alert-container');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validaciones básicas
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const date = document.getElementById('contact-date').value;
      const type = document.getElementById('contact-type').value;

      if (!name || !email || !phone || !date || !type) {
        showFormAlert('Por favor, complete todos los campos requeridos para agendar su cita.', 'error');
        return;
      }

      // Simular envío exitoso
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.setAttribute('disabled', 'true');
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Procesando cita...
      `;

      setTimeout(() => {
        submitBtn.removeAttribute('disabled');
        submitBtn.innerHTML = originalText;
        
        // Mensaje de éxito detallado
        showFormAlert(`¡Cita agendada con éxito! Nos comunicaremos con usted a la brevedad para confirmar la sesión ${type === 'presencial' ? 'presencial en nuestras oficinas de Quito' : 'virtual vía Teams/Zoom'} el día ${date}.`, 'success');
        
        // Limpiar formulario
        contactForm.reset();
      }, 1800);
    });
  }

  const showFormAlert = (message, status) => {
    if (!alertContainer) return;

    alertContainer.innerHTML = '';
    alertContainer.classList.remove('hidden');

    const isSuccess = status === 'success';
    const bgColor = isSuccess ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300' : 'bg-red-950/50 border-red-500 text-red-300';
    
    alertContainer.className = `p-4 border rounded-lg text-sm ${bgColor} mt-4 reveal-up`;
    alertContainer.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-lg">${isSuccess ? '✓' : '⚠'}</span>
        <p>${message}</p>
      </div>
    `;
    
    // Auto Scroll hacia la alerta
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
});
