<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Notifications', [
            'notifications' => Notification::query()
                ->with(['subscription:id,user_identifier,filter', 'vehicle:id,make_id,model_id,make,model,price,mileage,power,fuel_type,year'])
                ->latest()
                ->get()
                ->map(fn (Notification $notification) => [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'payload' => $notification->payload,
                    'created_at' => $notification->created_at?->toISOString(),
                    'subscription' => $notification->subscription,
                    'vehicle' => $notification->vehicle,
                ]),
        ]);
    }
}
