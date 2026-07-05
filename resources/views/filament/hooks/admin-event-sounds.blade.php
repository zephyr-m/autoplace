<script>
    (() => {
        const endpoint = @json(route('admin.event-counters'));
        const storageKey = 'admin-event-sound-counters';
        const pollIntervalMs = 5000;
        let audioContext = null;

        const readState = () => {
            try {
                return JSON.parse(localStorage.getItem(storageKey) || '{}');
            } catch {
                return {};
            }
        };

        const writeState = (state) => {
            localStorage.setItem(storageKey, JSON.stringify(state));
        };

        const getAudioContext = () => {
            audioContext ??= new (window.AudioContext || window.webkitAudioContext)();

            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            return audioContext;
        };

        const beep = (frequency, startOffset, duration, volume = 0.06) => {
            const context = getAudioContext();
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            const startAt = context.currentTime + startOffset;

            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0.0001, startAt);
            gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.start(startAt);
            oscillator.stop(startAt + duration + 0.02);
        };

        const playVehicleSound = () => {
            beep(520, 0, 0.12);
            beep(680, 0.13, 0.14);
        };

        const playNotificationSound = () => {
            beep(900, 0, 0.09, 0.07);
            beep(1180, 0.1, 0.16, 0.07);
        };

        const ensureToastRoot = () => {
            let root = document.getElementById('admin-event-toast-root');

            if (root) {
                return root;
            }

            root = document.createElement('div');
            root.id = 'admin-event-toast-root';
            root.style.position = 'fixed';
            root.style.right = '20px';
            root.style.bottom = '20px';
            root.style.zIndex = '9999';
            root.style.display = 'grid';
            root.style.gap = '10px';
            root.style.maxWidth = '360px';
            document.body.appendChild(root);

            return root;
        };

        const fuelLabel = (type) => ({
            gasoline: 'бензин',
            diesel: 'дизель',
            hybrid: 'гибрид',
            electric: 'электро',
            lpg: 'газ',
        }[type] || type || 'топливо не указано');

        const formatVehicleDetails = (vehicle) => [
            vehicle.year ? `${vehicle.year} год` : null,
            Number.isFinite(Number(vehicle.mileage)) ? `${Number(vehicle.mileage).toLocaleString('ru-RU')} км` : null,
            vehicle.fuel_type ? fuelLabel(vehicle.fuel_type) : null,
            Number.isFinite(Number(vehicle.power)) ? `${Number(vehicle.power).toLocaleString('ru-RU')} л.с.` : null,
            Number.isFinite(Number(vehicle.price)) ? `$${Number(vehicle.price).toLocaleString('ru-RU')}` : null,
        ].filter(Boolean).join(' · ');

        const showToast = ({ href = '#', title: titleText, details: detailsText, meta: metaText, variant = 'default' }) => {
            const root = ensureToastRoot();
            const toast = document.createElement('a');
            const title = document.createElement('strong');
            const details = document.createElement('span');
            const meta = document.createElement('small');
            const isSuccess = variant === 'success';

            toast.href = href;
            toast.style.display = 'grid';
            toast.style.gap = '6px';
            toast.style.padding = '14px 16px';
            toast.style.border = isSuccess ? '1px solid rgb(132 204 22)' : '1px solid rgb(24 24 27)';
            toast.style.borderRadius = '8px';
            toast.style.background = isSuccess ? 'rgb(236 252 203)' : 'white';
            toast.style.color = isSuccess ? 'rgb(54 83 20)' : 'rgb(24 24 27)';
            toast.style.boxShadow = '0 18px 45px rgba(0, 0, 0, 0.18)';
            toast.style.textDecoration = 'none';
            toast.style.fontSize = '13px';
            toast.style.lineHeight = '1.35';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(8px)';
            toast.style.transition = 'opacity 160ms ease, transform 160ms ease';

            title.textContent = titleText;
            title.style.fontSize = '14px';
            title.style.fontWeight = '700';

            details.textContent = detailsText;
            details.style.color = isSuccess ? 'rgb(63 98 18)' : 'rgb(82 82 91)';

            meta.textContent = metaText;
            meta.style.color = isSuccess ? 'rgb(77 124 15)' : 'rgb(113 113 122)';
            meta.style.fontWeight = '600';

            toast.append(title, details, meta);
            root.appendChild(toast);

            window.requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            });

            window.setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(8px)';
                window.setTimeout(() => toast.remove(), 200);
            }, 9000);
        };

        const showVehicleToast = (vehicle) => {
            if (!vehicle) {
                return;
            }

            showToast({
                href: vehicle.url || '#',
                title: `Добавлена новая машина: ${vehicle.title || `#${vehicle.id}`}`,
                details: formatVehicleDetails(vehicle),
                meta: vehicle.source_reference ? `Внешний ID: ${vehicle.source_reference}` : `ID: ${vehicle.id}`,
            });
        };

        const showNotificationToast = (notification) => {
            const vehicle = notification?.vehicle;

            if (!vehicle) {
                return;
            }

            showToast({
                href: notification.url || '#',
                title: `Совпадение по подписке: ${vehicle.title || `#${vehicle.id}`}`,
                details: formatVehicleDetails(vehicle),
                meta: notification.user_identifier
                    ? `Пользователь: ${notification.user_identifier} · Подписка #${notification.subscription_id}`
                    : `Подписка #${notification.subscription_id}`,
                variant: 'success',
            });
        };

        const unlockAudio = () => {
            getAudioContext();
            window.removeEventListener('pointerdown', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
        };

        window.addEventListener('pointerdown', unlockAudio, { once: true });
        window.addEventListener('keydown', unlockAudio, { once: true });

        const poll = async () => {
            try {
                const response = await fetch(endpoint, {
                    headers: {
                        Accept: 'application/json',
                    },
                    credentials: 'same-origin',
                });

                if (!response.ok) {
                    return;
                }

                const counters = await response.json();
                const previous = readState();
                const current = {
                    vehicleLatestId: Number(counters.vehicles?.latest_id || 0),
                    notificationLatestId: Number(counters.notifications?.latest_id || 0),
                };

                if (previous.vehicleLatestId === undefined || previous.notificationLatestId === undefined) {
                    writeState(current);
                    return;
                }

                if (current.vehicleLatestId > Number(previous.vehicleLatestId || 0)) {
                    playVehicleSound();
                    showVehicleToast(counters.vehicles?.latest);
                }

                if (current.notificationLatestId > Number(previous.notificationLatestId || 0)) {
                    playNotificationSound();
                    showNotificationToast(counters.notifications?.latest);
                }

                writeState(current);
            } catch {
                // Polling is best-effort; admin UI should not be affected by sound checks.
            }
        };

        poll();
        window.setInterval(poll, pollIntervalMs);
    })();
</script>
