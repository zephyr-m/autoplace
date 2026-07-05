import type { Vehicle } from '../model/types';

import Button from '@/shared/ui/Button';

interface VehicleTableProps {
    vehicles: Vehicle[];
}

export default function VehicleTable({ vehicles }: VehicleTableProps) {
    return (
        <div className="bg-white border border-zinc-200 rounded-lg overflow-x-auto shadow-sm">
            <table className="w-full border-collapse text-left text-sm">
                <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50">
                        <th className="p-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Фото</th>
                        <th className="p-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Автомобиль</th>
                        <th className="p-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Год</th>
                        <th className="p-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Пробег</th>
                        <th className="p-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Топливо</th>
                        <th className="p-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Мощность</th>
                        <th className="p-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Продавец</th>
                        <th className="p-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Цена</th>
                        <th className="p-3"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                    {vehicles.map(vehicle => (
                        <tr key={vehicle.id} className="hover:bg-zinc-50">
                            <td className="p-3">
                                <div className="relative group size-10">
                                    <img src={vehicle.image} alt={vehicle.title} className="size-10 object-cover rounded border border-zinc-200" />
                                    <div className="hidden group-hover:block absolute left-12 top-1/2 -translate-y-1/2 z-40 w-48 h-36 bg-white border border-zinc-200 rounded shadow-md overflow-hidden">
                                        <img src={vehicle.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </td>
                            <td className="p-3 font-semibold text-zinc-900">
                                <div>{vehicle.title}</div>
                                <div className="text-zinc-400 text-xs font-normal">{vehicle.description}</div>
                            </td>
                            <td className="p-3 text-zinc-700 font-medium">{vehicle.year}</td>
                            <td className="p-3 text-zinc-700 font-medium">{vehicle.mileage.toLocaleString()} км</td>
                            <td className="p-3 text-zinc-700 font-medium capitalize">
                                {vehicle.fuel_type === 'gasoline' ? 'Бензин' : vehicle.fuel_type === 'diesel' ? 'Дизель' : 'Электро'}
                            </td>
                            <td className="p-3 text-zinc-700 font-medium">{vehicle.power} л.с.</td>
                            <td className="p-3 text-zinc-500 font-medium">{vehicle.seller}</td>
                            <td className="p-3 font-bold text-zinc-950">${vehicle.price.toLocaleString()}</td>
                            <td className="p-3 text-right">
                                <Button variant="outline" size="sm" className="h-7 px-2 font-bold text-zinc-700">
                                    Открыть
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {vehicles.length === 0 && (
                        <tr>
                            <td colSpan={9} className="p-10 text-center text-zinc-400">
                                Автомобили не найдены. Попробуйте сбросить фильтры.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
