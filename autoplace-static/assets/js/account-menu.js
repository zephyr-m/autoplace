class AccountSidebar extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute('active') || 'overview';
    const items = [
      { key: 'overview', href: 'account.html', icon: '⌂', label: 'Обзор' },
      { key: 'favorites', href: 'account.html#favorites', icon: '♡', label: 'Избранное', stub: true },
      { key: 'searches', href: 'account.html#searches', icon: '⌕', label: 'Сохранённые поиски', stub: true },
      { key: 'notifications', href: 'notifications.html', icon: '●', label: 'Уведомления' },
      { key: 'messages', href: 'account.html#messages', icon: '✉', label: 'Сообщения', stub: true },
      { key: 'settings', href: 'settings.html', icon: '⚙', label: 'Настройки' },
    ];

    this.innerHTML = `
      <aside class="account-sidebar" aria-label="Разделы кабинета">
        ${items.map((item) => `
          <a class="sidebar-link${item.key === active ? ' active' : ''}${item.stub ? ' is-stub' : ''}" href="${item.href}">
            <span>${item.icon}</span>${item.label}
          </a>
        `).join('')}
      </aside>
    `;
  }
}

customElements.define('account-sidebar', AccountSidebar);
