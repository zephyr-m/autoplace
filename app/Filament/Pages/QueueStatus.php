<?php

namespace App\Filament\Pages;

use App\Support\DemoVehicleGeneration;
use BackedEnum;
use Carbon\CarbonImmutable;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class QueueStatus extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCircleStack;

    protected static ?string $navigationLabel = 'Очередь';

    protected static ?string $title = 'Очередь';

    protected static ?int $navigationSort = 6;

    protected static string $routePath = '/queue-status';

    protected string $view = 'filament.pages.queue-status';

    protected function getHeaderActions(): array
    {
        return [
            Action::make('startDemoVehicleGeneration')
                ->label('Запустить автогенерацию')
                ->icon('heroicon-o-play')
                ->color('success')
                ->visible(fn (): bool => ! DemoVehicleGeneration::isEnabled())
                ->action(function (): void {
                    DemoVehicleGeneration::enable();

                    Notification::make()
                        ->title('Автогенерация запущена')
                        ->success()
                        ->send();
                }),
            Action::make('stopDemoVehicleGeneration')
                ->label('Остановить автогенерацию')
                ->icon('heroicon-o-pause')
                ->color('danger')
                ->visible(fn (): bool => DemoVehicleGeneration::isEnabled())
                ->requiresConfirmation()
                ->action(function (): void {
                    DemoVehicleGeneration::disable();

                    Notification::make()
                        ->title('Автогенерация остановлена')
                        ->warning()
                        ->send();
                }),
        ];
    }

    /**
     * @return array{generation_enabled: bool, total: int, pending: int, delayed: int, reserved: int, failed: int, oldest_pending: string}
     */
    public function getSummary(): array
    {
        $now = now()->timestamp;
        $oldestPending = DB::table('jobs')
            ->whereNull('reserved_at')
            ->where('available_at', '<=', $now)
            ->min('created_at');

        return [
            'generation_enabled' => DemoVehicleGeneration::isEnabled(),
            'total' => DB::table('jobs')->count(),
            'pending' => DB::table('jobs')
                ->whereNull('reserved_at')
                ->where('available_at', '<=', $now)
                ->count(),
            'delayed' => DB::table('jobs')
                ->whereNull('reserved_at')
                ->where('available_at', '>', $now)
                ->count(),
            'reserved' => DB::table('jobs')
                ->whereNotNull('reserved_at')
                ->count(),
            'failed' => DB::table('failed_jobs')->count(),
            'oldest_pending' => $oldestPending ? $this->formatTimestamp((int) $oldestPending) : 'N/A',
        ];
    }

    public function getJobs(): Collection
    {
        return DB::table('jobs')
            ->orderByDesc('id')
            ->limit(25)
            ->get()
            ->map(fn (object $job): object => (object) [
                'id' => $job->id,
                'queue' => $job->queue,
                'name' => $this->jobName($job->payload),
                'attempts' => $job->attempts,
                'status' => $job->reserved_at ? 'reserved' : ($job->available_at > now()->timestamp ? 'delayed' : 'pending'),
                'available_at' => $this->formatTimestamp((int) $job->available_at),
                'reserved_at' => $job->reserved_at ? $this->formatTimestamp((int) $job->reserved_at) : 'N/A',
                'created_at' => $this->formatTimestamp((int) $job->created_at),
            ]);
    }

    public function getFailedJobs(): Collection
    {
        return DB::table('failed_jobs')
            ->orderByDesc('id')
            ->limit(25)
            ->get()
            ->map(fn (object $job): object => (object) [
                'id' => $job->id,
                'uuid' => $job->uuid,
                'connection' => $job->connection,
                'queue' => $job->queue,
                'name' => $this->jobName($job->payload),
                'exception' => str($job->exception)->before("\n")->limit(180)->toString(),
                'failed_at' => $job->failed_at,
            ]);
    }

    private function jobName(string $payload): string
    {
        $decoded = json_decode($payload, true);

        if (! is_array($decoded)) {
            return 'Unknown job';
        }

        return (string) ($decoded['displayName'] ?? $decoded['job'] ?? 'Unknown job');
    }

    private function formatTimestamp(int $timestamp): string
    {
        return CarbonImmutable::createFromTimestamp($timestamp)->format('Y-m-d H:i:s');
    }
}
