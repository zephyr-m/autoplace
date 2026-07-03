const numberFormatter = new Intl.NumberFormat('ru-RU');

    function parseNumber(value) {
      const parsed = Number(String(value).replace(/[^\d-]/g, ''));
      return Number.isFinite(parsed) ? parsed : 0;
    }

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function formatValue(value, format) {
      if (format === 'currency') {
        return `$${numberFormatter.format(value)}`;
      }

      if (format === 'mileage') {
        return `${numberFormatter.format(value)} км`;
      }

      return numberFormatter.format(value);
    }

    document.querySelectorAll('[data-multiselect]').forEach((select) => {
      const trigger = select.querySelector('.select-trigger');
      const triggerLabel = select.querySelector('[data-trigger-label]');
      const search = select.querySelector('[data-select-search]');
      const optionList = select.querySelector('[data-option-list]');
      const options = Array.from(select.querySelectorAll('[data-option]'));
      const tags = select.querySelector('[data-selected-tags]');
      const placeholder = select.dataset.placeholder || 'Не выбрано';

      function selectedOptions() {
        return options.filter((option) => option.querySelector('input').checked);
      }

      function renderTags() {
        const selected = selectedOptions();
        triggerLabel.textContent = selected.length ? `Выбрано: ${selected.length}` : placeholder;
        tags.innerHTML = '';

        selected.forEach((option) => {
          const value = option.dataset.option;
          const tag = document.createElement('span');
          tag.className = 'tag';
          tag.innerHTML = `<span>${value}</span><button type="button" aria-label="Убрать ${value}">×</button>`;
          tag.querySelector('button').addEventListener('click', () => {
            option.querySelector('input').checked = false;
            renderTags();
          });
          tags.append(tag);
        });
      }

      function filterOptions() {
        const query = search.value.trim().toLowerCase();
        let visibleCount = 0;
        optionList.querySelectorAll('.option-empty').forEach((node) => node.remove());

        options.forEach((option) => {
          const isVisible = option.dataset.option.toLowerCase().includes(query);
          option.style.display = isVisible ? '' : 'none';
          if (isVisible) {
            visibleCount += 1;
          }
        });

        if (visibleCount === 0) {
          const empty = document.createElement('div');
          empty.className = 'option-empty';
          empty.textContent = 'Ничего не найдено';
          optionList.append(empty);
        }
      }

      trigger.addEventListener('click', () => {
        const isOpen = select.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(isOpen));

        if (isOpen) {
          search.focus();
        }
      });

      search.addEventListener('input', filterOptions);

      options.forEach((option) => {
        option.querySelector('input').addEventListener('change', renderTags);
      });

      renderTags();
    });

    document.addEventListener('click', (event) => {
      document.querySelectorAll('[data-multiselect].open').forEach((select) => {
        if (!select.contains(event.target)) {
          select.classList.remove('open');
          select.querySelector('.select-trigger').setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.querySelectorAll('[data-range-filter]').forEach((range) => {
      const min = Number(range.dataset.min);
      const max = Number(range.dataset.max);
      const step = Number(range.dataset.step);
      const format = range.dataset.format;
      const minInput = range.querySelector('[data-range-input="min"]');
      const maxInput = range.querySelector('[data-range-input="max"]');
      const minSlider = range.querySelector('[data-range-slider="min"]');
      const maxSlider = range.querySelector('[data-range-slider="max"]');
      const fill = range.querySelector('.slider-fill');

      function snap(value) {
        return Math.round(value / step) * step;
      }

      function update(source) {
        let from = source === minInput ? parseNumber(minInput.value) : Number(minSlider.value);
        let to = source === maxInput ? parseNumber(maxInput.value) : Number(maxSlider.value);

        if (source === minInput || source === maxInput) {
          from = parseNumber(minInput.value);
          to = parseNumber(maxInput.value);
        }

        from = clamp(snap(from), min, max);
        to = clamp(snap(to), min, max);

        if (from > to) {
          if (source === minInput || source === minSlider) {
            to = from;
          } else {
            from = to;
          }
        }

        minInput.value = formatValue(from, format);
        maxInput.value = formatValue(to, format);
        minSlider.value = String(from);
        maxSlider.value = String(to);

        const fromPercent = ((from - min) / (max - min)) * 100;
        const toPercent = 100 - ((to - min) / (max - min)) * 100;
        fill.style.setProperty('--from', `${fromPercent}%`);
        fill.style.setProperty('--to', `${toPercent}%`);
      }

      [minInput, maxInput].forEach((input) => {
        input.addEventListener('change', () => update(input));
        input.addEventListener('blur', () => update(input));
      });

      [minSlider, maxSlider].forEach((slider) => {
        slider.addEventListener('input', () => update(slider));
      });

      update(minSlider);
    });

    document.querySelector('[data-reset-filters]').addEventListener('click', () => {
      document.querySelectorAll('[data-multiselect] input[type="checkbox"]').forEach((input) => {
        input.checked = false;
        input.dispatchEvent(new Event('change'));
      });
    });

    const catalogView = document.querySelector('[data-catalog-view]');
    document.querySelectorAll('[data-view]').forEach((button) => {
      button.addEventListener('click', () => {
        const view = button.dataset.view;
        catalogView.className = `catalog-view ${view}`;
        document.querySelectorAll('[data-view]').forEach((item) => item.classList.toggle('active', item === button));
      });
    });
