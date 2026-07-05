<x-filament-panels::page>
    <div wire:poll.10s class="space-y-6">
        @php
            $summary = $this->getSummary();
            $jobs = $this->getJobs();
            $failedJobs = $this->getFailedJobs();
        @endphp

        <div @class([
            'rounded-lg border p-4 text-sm font-semibold shadow-sm',
            'border-lime-200 bg-lime-50 text-lime-800' => $summary['generation_enabled'],
            'border-red-200 bg-red-50 text-red-700' => ! $summary['generation_enabled'],
        ])>
            Автогенерация машин:
            {{ $summary['generation_enabled'] ? 'включена' : 'остановлена' }}
        </div>

        <div class="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            @foreach ([
                'Всего' => $summary['total'],
                'Ожидают' => $summary['pending'],
                'Отложены' => $summary['delayed'],
                'В работе' => $summary['reserved'],
                'Ошибки' => $summary['failed'],
                'Самая старая' => $summary['oldest_pending'],
            ] as $label => $value)
                <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ $label }}</div>
                    <div class="mt-2 text-2xl font-semibold text-gray-950 dark:text-white">{{ $value }}</div>
                </div>
            @endforeach
        </div>

        <section class="space-y-3">
            <div class="flex items-center justify-between gap-3">
                <h2 class="text-base font-semibold text-gray-950 dark:text-white">Текущие задания</h2>
                <span class="text-sm text-gray-500 dark:text-gray-400">Последние 25</span>
            </div>

            <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-800">
                    <thead class="bg-gray-50 dark:bg-gray-950">
                        <tr>
                            <th class="px-4 py-3 text-left font-semibold">ID</th>
                            <th class="px-4 py-3 text-left font-semibold">Queue</th>
                            <th class="px-4 py-3 text-left font-semibold">Job</th>
                            <th class="px-4 py-3 text-left font-semibold">Status</th>
                            <th class="px-4 py-3 text-left font-semibold">Attempts</th>
                            <th class="px-4 py-3 text-left font-semibold">Available</th>
                            <th class="px-4 py-3 text-left font-semibold">Reserved</th>
                            <th class="px-4 py-3 text-left font-semibold">Created</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                        @forelse ($jobs as $job)
                            <tr>
                                <td class="whitespace-nowrap px-4 py-3">{{ $job->id }}</td>
                                <td class="whitespace-nowrap px-4 py-3">{{ $job->queue }}</td>
                                <td class="px-4 py-3">{{ $job->name }}</td>
                                <td class="whitespace-nowrap px-4 py-3">{{ $job->status }}</td>
                                <td class="whitespace-nowrap px-4 py-3">{{ $job->attempts }}</td>
                                <td class="whitespace-nowrap px-4 py-3">{{ $job->available_at }}</td>
                                <td class="whitespace-nowrap px-4 py-3">{{ $job->reserved_at }}</td>
                                <td class="whitespace-nowrap px-4 py-3">{{ $job->created_at }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="8" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Очередь пуста</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </section>

        <section class="space-y-3">
            <div class="flex items-center justify-between gap-3">
                <h2 class="text-base font-semibold text-gray-950 dark:text-white">Упавшие задания</h2>
                <span class="text-sm text-gray-500 dark:text-gray-400">Последние 25</span>
            </div>

            <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-800">
                    <thead class="bg-gray-50 dark:bg-gray-950">
                        <tr>
                            <th class="px-4 py-3 text-left font-semibold">ID</th>
                            <th class="px-4 py-3 text-left font-semibold">UUID</th>
                            <th class="px-4 py-3 text-left font-semibold">Connection</th>
                            <th class="px-4 py-3 text-left font-semibold">Queue</th>
                            <th class="px-4 py-3 text-left font-semibold">Job</th>
                            <th class="px-4 py-3 text-left font-semibold">Exception</th>
                            <th class="px-4 py-3 text-left font-semibold">Failed</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                        @forelse ($failedJobs as $job)
                            <tr>
                                <td class="whitespace-nowrap px-4 py-3">{{ $job->id }}</td>
                                <td class="whitespace-nowrap px-4 py-3">{{ $job->uuid }}</td>
                                <td class="whitespace-nowrap px-4 py-3">{{ $job->connection }}</td>
                                <td class="whitespace-nowrap px-4 py-3">{{ $job->queue }}</td>
                                <td class="px-4 py-3">{{ $job->name }}</td>
                                <td class="px-4 py-3">{{ $job->exception }}</td>
                                <td class="whitespace-nowrap px-4 py-3">{{ $job->failed_at }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Ошибок нет</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</x-filament-panels::page>
