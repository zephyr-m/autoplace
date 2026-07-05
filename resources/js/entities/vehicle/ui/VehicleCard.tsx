import Button from '@/shared/ui/Button';
import type { Vehicle } from '../model/types';

interface VehicleCardProps {
    vehicle: Vehicle;
    viewMode: 'list' | 'gallery';
}

export default function VehicleCard({ vehicle, viewMode }: VehicleCardProps) {
    if (viewMode === 'gallery') {
        return (
            <article className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-colors">
                <div>
                    <div className="relative aspect-[4/3] bg-zinc-50 w-full">
                        <img src={vehicle.image} alt={vehicle.title} className="w-full h-full object-cover" />
                        {vehicle.tag && (
                            <span className="absolute top-2.5 left-2.5 rounded-full bg-white/94 backdrop-blur-md px-2.5 py-0.5 text-xs font-bold text-zinc-900 border border-zinc-200">
                                {vehicle.tag}
                            </span>
                        )}
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-base text-zinc-950 leading-snug">{vehicle.title}</h3>
                            <span className="text-base font-extrabold text-zinc-900">${vehicle.price.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            <span className="bg-zinc-100 text-zinc-500 rounded px-2 py-0.5 text-xs font-semibold">{vehicle.year}</span>
                            <span className="bg-zinc-100 text-zinc-500 rounded px-2 py-0.5 text-xs font-semibold">{vehicle.mileage.toLocaleString()} км</span>
                            <span className="bg-zinc-100 text-zinc-500 rounded px-2 py-0.5 text-xs font-semibold">
                                {vehicle.fuel_type === 'gasoline' ? 'Бензин' : vehicle.fuel_type === 'electric' ? 'Электро' : 'Дизель'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 pt-0">
                    <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500 mt-2">
                        <span className="font-semibold text-zinc-800">{vehicle.seller}</span>
                        <Button variant="outline" size="sm" className="h-7 font-bold text-zinc-700">
                            Подробнее
                        </Button>
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article className="bg-white border border-zinc-200 rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-[240px_1fr] shadow-sm hover:border-zinc-300 transition-colors">
            <div className="relative aspect-[4/3] md:aspect-auto bg-zinc-50 w-full min-h-[160px]">
                <img src={vehicle.image} alt={vehicle.title} className="w-full h-full object-cover" />
                {vehicle.tag && (
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-white/94 backdrop-blur-md px-2.5 py-0.5 text-xs font-bold text-zinc-900 border border-zinc-200">
                        {vehicle.tag}
                    </span>
                )}
            </div>

            <div className="p-5 flex flex-col justify-between">
                <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h3 className="font-bold text-lg text-zinc-950 leading-tight">{vehicle.title}</h3>
                            <p className="text-zinc-500 text-xs mt-1 font-medium">{vehicle.description}</p>
                        </div>
                        <span className="text-xl font-extrabold text-zinc-900">${vehicle.price.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="bg-zinc-100 text-zinc-600 rounded px-2.5 py-0.5 text-xs font-semibold">{vehicle.year} г.</span>
                        <span className="bg-zinc-100 text-zinc-600 rounded px-2.5 py-0.5 text-xs font-semibold">{vehicle.mileage.toLocaleString()} км</span>
                        <span className="bg-zinc-100 text-zinc-600 rounded px-2.5 py-0.5 text-xs font-semibold">
                            {vehicle.fuel_type === 'gasoline' ? 'Бензин' : vehicle.fuel_type === 'diesel' ? 'Дизель' : vehicle.fuel_type === 'electric' ? 'Электро' : 'Гибрид'}
                        </span>
                        <span className="bg-zinc-100 text-zinc-600 rounded px-2.5 py-0.5 text-xs font-semibold">{vehicle.power} л.с.</span>
                        <span className="bg-zinc-100 text-zinc-600 rounded px-2.5 py-0.5 text-xs font-semibold">{vehicle.transmission}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-100 pt-3.5 mt-4">
                    <p className="text-xs text-zinc-500 font-medium">
                        <strong className="text-zinc-900 font-semibold">{vehicle.seller}</strong> · {vehicle.city} · {vehicle.date}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="font-bold text-zinc-700">
                            Сравнить
                        </Button>
                        <Button variant="default" size="sm" className="font-bold">
                            Подробнее
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    );
}
