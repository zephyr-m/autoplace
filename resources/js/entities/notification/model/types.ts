export interface AccountNotification {
    id: string;
    type: string;
    status: number;
    payload: Record<string, unknown> | null;
    read_at: string | null;
    created_at: string | null;
    subscription: {
        id: string;
        user_identifier: string;
    } | null;
    vehicle: {
        id: string;
        source_reference: string;
        price: number;
        mileage: number;
        power: number;
        fuel_type: string;
        year: number;
        make: {
            name: string;
        } | null;
        model: {
            name: string;
        } | null;
    } | null;
}
