(() => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const mobileDrawer = document.querySelector(".mobile-drawer");
  const menuButton = document.querySelector(".menu-button");
  const drawerClose = mobileDrawer?.querySelector(".drawer-close");
  const drawerBackdrop = mobileDrawer?.querySelector(".drawer-backdrop");
  const modal = document.querySelector(".modal");
  const modalClose = modal?.querySelector(".modal-close");
  const modalBackdrop = modal?.querySelector(".modal-backdrop");
  const modalContext = modal?.querySelector("[name='context']");
  const modalHeading = modal?.querySelector("[data-modal-heading]");
  let lastFocused = null;

  const focusableSelector =
    "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

  const toTop = document.querySelector(".to-top");
  const footer = document.querySelector(".site-footer");

  // Кнопка возврата появляется, когда прокручен примерно экран с половиной:
  // раньше она мешала бы первому экрану, позже – уже не спасала бы.
  // И прячется, когда подвал доехал до низа окна: круглая кнопка ложилась
  // прямо на ссылки о персональных данных и перекрывала их.
  const setScrollState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
    if (toTop) {
      const scrolled = window.scrollY > window.innerHeight * 1.5;
      const footerReached = footer
        ? footer.getBoundingClientRect().top < window.innerHeight - 90
        : false;
      const show = scrolled && !footerReached;
      toTop.hidden = !show;
      toTop.classList.toggle("is-visible", show);
    }
  };

  setScrollState();
  window.addEventListener("scroll", setScrollState, { passive: true });

  toTop?.addEventListener("click", () => {
    const smooth = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "instant" });
    // Возврат наверх меняет положение на странице, поэтому фокус уходит
    // к началу содержимого, а не остаётся на исчезнувшей кнопке.
    document.querySelector(".site-header a, .site-header button")?.focus();
  });

  const trapFocus = (event, container) => {
    if (event.key !== "Tab") return;
    const items = [...container.querySelectorAll(focusableSelector)].filter(
      (item) => !item.hasAttribute("hidden") && item.offsetParent !== null,
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const closeNavPanels = (except = null) => {
    document.querySelectorAll(".nav-trigger").forEach((trigger) => {
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));
      if (trigger === except) return;
      trigger.setAttribute("aria-expanded", "false");
      panel?.classList.remove("is-open");
    });
  };

  // На мыши меню раскрывается наведением: это делает CSS, а скрипт лишь
  // держит aria-expanded в согласии с тем, что видно на экране. Клик остаётся
  // для клавиатуры и сенсорных экранов, где наведения нет.
  const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)");

  document.querySelectorAll(".nav-trigger").forEach((trigger) => {
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    const item = trigger.closest(".nav-item");

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      // С мышью раздел открывается по клику как обычная ссылка, а панель
      // уже раскрыта наведением.
      if (hoverCapable.matches) return;
      // На сенсорном экране первое касание раскрывает панель, второе уводит
      // в раздел, поэтому переход отменяется только на первом.
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      if (!isOpen) event.preventDefault();
      closeNavPanels(trigger);
      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel?.classList.toggle("is-open", !isOpen);
    });

    item?.addEventListener("pointerenter", () => {
      if (!hoverCapable.matches) return;
      trigger.setAttribute("aria-expanded", "true");
    });

    item?.addEventListener("pointerleave", () => {
      if (!hoverCapable.matches) return;
      trigger.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", () => closeNavPanels());

  // Меню приходит с CSS-переходом: сначала снимаем hidden, класс is-open
  // добавляем следующим кадром, иначе браузер схлопнет анимацию.
  const openDrawer = () => {
    if (!mobileDrawer) return;
    lastFocused = document.activeElement;
    mobileDrawer.hidden = false;
    requestAnimationFrame(() => mobileDrawer.classList.add("is-open"));
    body.classList.add("menu-open");
    menuButton?.setAttribute("aria-expanded", "true");
    drawerClose?.focus();
  };

  const closeDrawer = () => {
    if (!mobileDrawer || mobileDrawer.hidden) return;
    mobileDrawer.classList.remove("is-open");
    window.setTimeout(() => {
      mobileDrawer.hidden = true;
    }, 380);
    body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
    lastFocused?.focus();
  };

  menuButton?.addEventListener("click", openDrawer);
  drawerClose?.addEventListener("click", closeDrawer);
  drawerBackdrop?.addEventListener("click", closeDrawer);
  mobileDrawer?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeDrawer));

  const openModal = (trigger) => {
    if (!modal) return;
    lastFocused = document.activeElement;
    const context = trigger?.dataset.lead || "Общий подбор системы";
    const heading = trigger?.dataset.leadTitle || "Подобрать систему";
    if (modalContext) modalContext.value = context;
    if (modalHeading) modalHeading.textContent = heading;
    modal.hidden = false;
    // Класс появляется следующим кадром, иначе переход не проигрывается
    // и окно возникает рывком.
    requestAnimationFrame(() => modal.classList.add("is-open"));
    body.classList.add("modal-open");
    modalClose?.focus();
  };

  const closeModal = () => {
    if (!modal || modal.hidden) return;
    modal.classList.remove("is-open");
    window.setTimeout(() => {
      modal.hidden = true;
    }, 280);
    body.classList.remove("modal-open");
    lastFocused?.focus();
  };

  document.querySelectorAll("[data-lead]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      closeDrawer();
      openModal(trigger);
    });
  });

  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavPanels();
      closeDrawer();
      closeModal();
      return;
    }

    if (mobileDrawer && !mobileDrawer.hidden) trapFocus(event, mobileDrawer);
    if (modal && !modal.hidden) trapFocus(event, modal);
  });

  document.querySelectorAll("[role='tablist']").forEach((tabList) => {
    const tabs = [...tabList.querySelectorAll("[role='tab']")];
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        tabs.forEach((item) => {
          const panel = document.getElementById(item.getAttribute("aria-controls"));
          const active = item === tab;
          item.setAttribute("aria-selected", String(active));
          item.tabIndex = active ? 0 : -1;
          if (panel) panel.hidden = !active;
        });
      });

      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        tabs[(index + direction + tabs.length) % tabs.length].click();
        tabs[(index + direction + tabs.length) % tabs.length].focus();
      });
    });
  });

  // Адрес обработчика заявок. Пока он пуст, форма проверяет данные и честно
  // сообщает, что отправка не подключена: молча терять обращения нельзя.
  // При запуске сюда прописывается адрес приёмника, остальное менять не нужно.
  const LEAD_ENDPOINT = "";
  const MAX_FILE_MB = 10;
  const ALLOWED_FILE_TYPES = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];

  const digitsOf = (value) => (value || "").replace(/\D/g, "");

  // Российский номер: одиннадцать цифр с семёркой или восьмёркой впереди,
  // либо десять цифр, если код страны не набрали.
  const isPhoneValid = (value) => {
    const digits = digitsOf(value);
    if (digits.length === 11) return /^[78]/.test(digits);
    return digits.length === 10;
  };

  const formatPhone = (value) => {
    let digits = digitsOf(value);
    if (!digits) return "";
    if (digits[0] === "8") digits = "7" + digits.slice(1);
    if (digits[0] !== "7") digits = "7" + digits;
    digits = digits.slice(0, 11);

    let out = "+7";
    if (digits.length > 1) out += " (" + digits.slice(1, 4);
    if (digits.length >= 4) out += ")";
    if (digits.length > 4) out += " " + digits.slice(4, 7);
    if (digits.length > 7) out += "-" + digits.slice(7, 9);
    if (digits.length > 9) out += "-" + digits.slice(9, 11);
    return out;
  };

  const errorFor = (field) => {
    const ids = (field.getAttribute("aria-describedby") || "").split(" ");
    for (const id of ids) {
      const node = document.getElementById(id);
      if (node?.classList.contains("field-error")) return node;
    }
    return null;
  };

  const setFieldError = (field, message) => {
    const holder = errorFor(field);
    field.classList.toggle("is-invalid", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (!holder) return;
    holder.textContent = message || "";
    holder.hidden = !message;
  };

  const checkField = (field) => {
    if (field.type === "checkbox") {
      if (field.required && !field.checked) {
        setFieldError(field, "Без согласия на обработку данных заявку принять нельзя.");
        return false;
      }
    } else if (field.type === "tel") {
      const value = field.value.trim();
      if (!value) {
        setFieldError(field, "Оставьте номер: без него мы не сможем ответить.");
        return false;
      }
      if (!isPhoneValid(value)) {
        setFieldError(field, "Проверьте номер: нужно десять цифр после кода страны.");
        return false;
      }
    } else if (field.type === "file") {
      const file = field.files && field.files[0];
      if (file) {
        const extension = file.name.split(".").pop().toLowerCase();
        if (!ALLOWED_FILE_TYPES.includes(extension)) {
          setFieldError(field, "Подойдёт PDF, фотография протокола или документ Word.");
          return false;
        }
        if (file.size > MAX_FILE_MB * 1024 * 1024) {
          setFieldError(field, `Файл больше ${MAX_FILE_MB} МБ. Пришлите фотографию поменьше или PDF.`);
          return false;
        }
      }
    } else if (field.required && !field.value.trim()) {
      setFieldError(field, "Выберите значение, иначе расчёт будет наугад.");
      return false;
    }

    setFieldError(field, "");
    return true;
  };

  const showStatus = (form, text, kind) => {
    const status = form.querySelector(".form-status");
    if (!status) return;
    status.textContent = text;
    status.classList.add("is-visible");
    status.classList.toggle("is-error", kind === "error");
    status.classList.toggle("is-success", kind === "success");
  };

  document.querySelectorAll("form[data-lead-form]").forEach((form) => {
    const started = form.querySelector("[data-form-started]");
    if (started) started.value = String(Date.now());

    const phone = form.querySelector('input[type="tel"]');
    if (phone) {
      phone.addEventListener("input", () => {
        const caretAtEnd = phone.selectionStart === phone.value.length;
        const formatted = formatPhone(phone.value);
        phone.value = formatted;
        if (caretAtEnd) phone.setSelectionRange(formatted.length, formatted.length);
        if (phone.classList.contains("is-invalid")) checkField(phone);
      });
    }

    // Повторную проверку поля делаем только после первой неудачной отправки:
    // подсказывать об ошибке, пока человек ещё печатает, невежливо.
    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("change", () => {
        if (field.classList.contains("is-invalid")) checkField(field);
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const fields = [...form.querySelectorAll("input, select, textarea")].filter(
        (field) => field.type !== "hidden" && field.name !== "company",
      );
      let firstBad = null;
      fields.forEach((field) => {
        if (!checkField(field) && !firstBad) firstBad = field;
      });

      if (firstBad) {
        showStatus(form, "Проверьте отмеченные поля – без них заявку не принять.", "error");
        firstBad.focus();
        return;
      }

      // Ловушка для роботов: поле спрятано от людей, а автозаполнение его видит.
      const honey = form.querySelector('input[name="company"]');
      if (honey && honey.value) {
        showStatus(form, "Заявка принята.", "success");
        return;
      }

      const button = form.querySelector('button[type="submit"]');
      const label = button?.textContent;
      if (button) {
        button.disabled = true;
        button.classList.add("is-busy");
        button.textContent = "Отправляем…";
      }

      const finish = (text, kind) => {
        if (button) {
          button.disabled = false;
          button.classList.remove("is-busy");
          button.textContent = label;
        }
        showStatus(form, text, kind);
        form.querySelector(".form-status")?.focus();
      };

      if (!LEAD_ENDPOINT) {
        finish(
          "Данные заполнены верно, но приём заявок ещё не подключён: письмо никуда не ушло. Позвоните по телефону в шапке.",
          "error",
        );
        return;
      }

      try {
        const payload = new FormData(form);
        // Время заполнения уходит вместе с заявкой: слишком быстрый ответ
        // разбирает уже приёмник, а живого человека блокировать нельзя.
        payload.set("elapsed", String(Date.now() - Number(started?.value || Date.now())));
        const response = await fetch(LEAD_ENDPOINT, { method: "POST", body: payload });
        if (!response.ok) throw new Error(String(response.status));
        form.reset();
        if (started) started.value = String(Date.now());
        finish(
          "Заявка принята. Специалист свяжется с вами, уточнит исходные данные и скажет, чего не хватает для расчёта.",
          "success",
        );
      } catch (error) {
        finish(
          "Не получилось отправить заявку. Проверьте связь и попробуйте ещё раз или позвоните по телефону в шапке.",
          "error",
        );
      }
    });
  });


  // Витрина каталога: фильтр по бренду и назначению, сортировка по цене.
  // Без скрипта витрина остаётся полной, поэтому панель фильтров спрятана
  // атрибутом hidden и включается только отсюда.
  const filterBar = document.querySelector("[data-filter-bar]");
  const productGrid = document.querySelector("[data-product-grid]");
  if (filterBar && productGrid) {
    filterBar.hidden = false;
    const tiles = [...productGrid.querySelectorAll(".product-tile")];
    const emptyNote = document.querySelector("[data-filter-empty]");
    const catSelect = filterBar.querySelector("[data-filter-cat]");
    const sortSelect = filterBar.querySelector("[data-filter-sort]");
    const chips = [...filterBar.querySelectorAll("[data-filter-brand]")];
    let brand = "";

    const apply = () => {
      const cat = catSelect ? catSelect.value : "";
      let shown = 0;
      tiles.forEach((tile) => {
        const ok = (!brand || tile.dataset.brand === brand) && (!cat || tile.dataset.cat === cat);
        tile.classList.toggle("is-hidden", !ok);
        if (ok) shown += 1;
      });
      if (emptyNote) emptyNote.hidden = shown > 0;
      const sort = sortSelect ? sortSelect.value : "";
      if (sort) {
        const dir = sort === "price-desc" ? -1 : 1;
        [...tiles]
          .sort((a, b) => dir * (Number(a.dataset.price) - Number(b.dataset.price)))
          .forEach((tile) => productGrid.appendChild(tile));
      }
    };

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        brand = chip.dataset.filterBrand;
        chips.forEach((c) => c.classList.toggle("is-active", c === chip));
        apply();
      });
    });
    catSelect?.addEventListener("change", apply);
    sortSelect?.addEventListener("change", apply);
  }

  // Появление секций при скролле. Стили включаются только при разрешённой
  // анимации, поэтому наблюдателю дополнительные проверки не нужны.
  const revealTargets = document.querySelectorAll("main > .section, main > .section--tight");
  if ("IntersectionObserver" in window && revealTargets.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Секция выше окна тоже считается показанной: при прыжке по якорю
          // или мгновенной прокрутке она иначе осталась бы прозрачной.
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    revealTargets.forEach((el) => {
      el.classList.add("section-reveal");
      io.observe(el);
    });
  }

  // Лёгкий параллакс объекта на первом экране: доля прокрутки первого экрана
  // уходит в CSS-переменную, сдвиг ограничен в стилях сорока пикселями.
  const heroObject = document.querySelector(".hero-object img");
  const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)");
  if (heroObject && motionOk.matches) {
    let ticking = false;
    const updateShift = () => {
      ticking = false;
      const progress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      heroObject.style.setProperty("--hero-shift", progress.toFixed(3));
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateShift);
        }
      },
      { passive: true },
    );
  }
})();
