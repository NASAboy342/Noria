import { Building } from "../models/building"
import { AddRoomPayload } from "../models/addRoomPayload";
import { RoomUsage } from "../models/roomUsage";
import { useMessageStore } from "../stores/messageStore";

const API_BASE_URL = "https://noriabe.ppiinn.net";

export default function useApi() {
    const messageStore = useMessageStore()

    async function apiGet<T>(path: string): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${path}`)
        if (!response.ok) {
            let errorMessage = `GET ${path} failed: ${response.status} ${response.statusText}`
            try {
                const body = await response.json()
                if (body && typeof body.message === 'string') errorMessage = body.message
            } catch { /* ignore parse errors */ }
            messageStore.SetMessage(`កំហុស: ${errorMessage}`, 'error')
            throw new Error(errorMessage)
        }
        const data: T = await response.json()
        return data
    }

    async function apiPost<T>(path: string, payload: unknown): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        if (!response.ok) {
            let errorMessage = `POST ${path} failed: ${response.status} ${response.statusText}`
            try {
                const body = await response.json()
                if (body && typeof body.message === 'string') errorMessage = body.message
            } catch { /* ignore parse errors */ }
            messageStore.SetMessage(`កំហុស: ${errorMessage}`, 'error')
            throw new Error(errorMessage)
        }
        const data: T = await response.json().catch(() => null as T)
        return data
    }

    const getBuildings = async (): Promise<Building[]> => {
        const buildings = await apiGet<Building[]>('/System/get-all-building');
        messageStore.SetMessage('ព័ត៌មានអាគារត្រូវបានទាញយកដោយជោគជ័យ', 'success')
        return buildings;
    }

    const getRooms = async (buildingId: number): Promise<AddRoomPayload[]> => {
        const result = await apiGet<AddRoomPayload[]>(`/System/get-all-room-of-building?buildingId=${buildingId}`);
        messageStore.SetMessage('ព័ត៌មានបន្ទប់ត្រូវបានផ្ទុកដោយជោគជ័យ', 'success')
        return result
    }

    const addBuilding = async (building: Building): Promise<void> => {
        await apiPost('/System/add-building', building.toAddBuildingPayload())
        messageStore.SetMessage('ការបន្ថែមអាគារបានជោគជ័យ', 'success')
    }

    const getBuildingById = async (id: number): Promise<Building> => {
        const building = await getBuildings().then(buildings => buildings.find(b => b.id === id))
        if (!building) {
            const errorMessage = `អាគារដែលមាន id ${id} មិនត្រូវបានរកឃើញ`
            messageStore.SetMessage(errorMessage, 'error')
            throw new Error(errorMessage)
        }
        messageStore.SetMessage('ព័ត៌មានលម្អិតអាគារត្រូវបានផ្ទុកដោយជោគជ័យ', 'success')
        return building;
    }

    const updateBuilding = async (building: Building): Promise<void> => {
        await apiPost('/System/update-building', building)
        messageStore.SetMessage('រក្សាទុកព័ត៌មានអគារបានជោគជ័យ', 'success')
    }

    const addRoom = async (payload: AddRoomPayload): Promise<void> => {
        await apiPost('/System/add-room', payload)
        messageStore.SetMessage('បន្ថែមបន្ទប់បានជោគជ័យ', 'success')
    }

    const createPayment = async (payment: RoomUsage): Promise<void> => {
        await apiPost('/System/create-payment', payment)
        messageStore.SetMessage('រក្សាទុកវិក្កយបត្របានជោគជ័យ', 'success')
    }

    const doPayment = async (payment: RoomUsage): Promise<void> => {
        await apiPost('/System/do-payment', payment)
        messageStore.SetMessage('ការបង់ប្រាក់បានជោគជ័យ', 'success')
    }

    const getPaymentById = async (paymentId: number): Promise<RoomUsage> => {
        const result = await apiGet<RoomUsage>(`/System/get-room-payments-by-id?paymentId=${paymentId}`)
        return result
    }

    const getPaymentHistory = async (roomId: number, top: number): Promise<RoomUsage[]> => {
        const result = await apiGet<RoomUsage[]>(`/System/get-room-payments?roomId=${roomId}&lastN=${top}`)
        return result
    }

    const getRoom = async (buildingId: number, roomId: number): Promise<AddRoomPayload> => {
        const rooms = await getRooms(buildingId);
        const room = rooms.find(r => r.id === roomId);
        if (!room) {
            const errorMessage = `បន្ទប់ដែលមាន id ${roomId} មិនត្រូវបានរកឃើញ`
            messageStore.SetMessage(errorMessage, 'error')
            throw new Error(errorMessage)
        }
        messageStore.SetMessage('ព័ត៌មានលម្អិតបន្ទប់ត្រូវបានផ្ទុកដោយជោគជ័យ', 'success')
        return room;
    }

    const getLastRoomUsage = async (buildingId: number, roomId: number, beforePaymentId: number): Promise<RoomUsage> => {
        var payments = new Array<RoomUsage>();
        payments.push(...await getPaymentHistory(roomId, 5));
        if (payments.length === 0) {
            return new RoomUsage();
        }
        if (payments.length === 1) {
            return new RoomUsage();
        }
        payments = payments.filter(p => p.id !== beforePaymentId);
        return payments.length > 0 ? payments[0] : new RoomUsage();
    }

    const updatePayment = async (payment: RoomUsage): Promise<void> => {
        await apiPost('/System/update-payment', payment)
        messageStore.SetMessage('រក្សាទុកព័ត៌មានវិក្កយបត្របានជោគជ័យ', 'success')
    }

    return {
        apiGet,
        apiPost,
        getBuildings,
        getRooms,
        addBuilding,
        getBuildingById,
        updateBuilding,
        addRoom,
        getRoom,
        createPayment,
        doPayment,
        getPaymentById,
        getPaymentHistory,
        getLastRoomUsage,
        updatePayment
    }
}