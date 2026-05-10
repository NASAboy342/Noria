import { ref } from "vue"
import { Building } from "../models/building"
import { Room } from "../models/room";
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

    const getRooms = async (buildingId: number): Promise<Room[]> => {
        const rooms = ref<Room[]>([
            {
                buildingId: 1,
                id: 1,
                roomName: 'A1',
                phoneNumber: '09883373',
                floor: 'ផ្ទាល់ដី',
                isPaid: false,
                owe: 0,
                note: ''
            },
            {
                buildingId: 1,
                id: 2,
                roomName: 'A2',
                phoneNumber: '09883374',
                floor: 'ផ្ទាល់ដី',
                isPaid: true,
                owe: 0,
                note: ''
            },
            {
                buildingId: 1,
                id: 3,
                roomName: 'A5',
                phoneNumber: '09883375',
                floor: 'ទី1',
                isPaid: false,
                owe: 0,
                note: ''
            },
               {
                buildingId: 2,
                id: 1,
                roomName: 'B1',
                phoneNumber: '09883376',
                floor: 'ground',
                isPaid: false,
                owe: 0,
                note: ''
            },
               {
                buildingId: 3,
                id: 1,
                roomName: 'C1',
                phoneNumber: '09883377',
                floor: 'ground',
                isPaid: false,
                owe: 0,
                note: ''
            },


        ]);
        const result = rooms.value.filter(room => room.buildingId === buildingId)
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

    return {
        apiGet,
        apiPost,
        getBuildings,
        getRooms,
        addBuilding,
        getBuildingById,
        updateBuilding
    }
}