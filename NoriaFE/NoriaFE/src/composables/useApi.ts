import { ref } from "vue"
import { Building } from "../models/building"
import { Room } from "../models/room";

export default function useApi() {
    const getBuildings = (): Promise<Building[]> => {
        const buildings = ref<Building[]>([
            {
                id: 1,
                name: 'អាគារ A',
                address: 'ផ្លូវ ១២៣, ភ្នំពេញ',
                img: 'https://s1.rea.global/img/1080x799-prop/fazwaz_kh/kh/dbbaeeffc62b46f8ccdfe996c0b3379a.jpg',
                rooms: 10,
                occupiedRooms: 7,
                paidRooms: 5
            },
            {
                id: 2,
                name: 'អាគារ B',
                address: 'ផ្លូវ ១២៣, ភ្នំពេញ',
                img: 'https://s1.rea.global/img/1080x799-prop/fazwaz_kh/kh/dbbaeeffc62b46f8ccdfe996c0b3379a.jpg',
                rooms: 10,
                occupiedRooms: 7,
                paidRooms: 5
            },
            {
                id: 3,
                name: 'អាគារ C',
                address: 'ផ្លូវ ១២៣, ភ្នំពេញ',
                img: 'https://s1.rea.global/img/1080x799-prop/fazwaz_kh/kh/dbbaeeffc62b46f8ccdfe996c0b3379a.jpg',
                rooms: 10,
                occupiedRooms: 7,
                paidRooms: 5
            }
        ]);
        return buildings.value
    }

    const getRooms = (buildingId: number): Promise<Room[]> => {
        const rooms = ref<Room[]>([
            {
                buildingId: 1,
                id: 1,
                roomName: 'A1',
                phoneNumber: '09883373',
                floor: 'ground',
                isPaid: false,
                owe: 0,
                note: ''
            },
            {
                buildingId: 1,
                id: 2,
                roomName: 'A2',
                phoneNumber: '09883374',
                floor: 'ground',
                isPaid: false,
                owe: 0,
                note: ''
            },
            {
                buildingId: 1,
                id: 3,
                roomName: 'A3',
                phoneNumber: '09883375',
                floor: 'ground',
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
        return rooms.value.filter(room => room.buildingId === buildingId)
    }

    return {
        getBuildings,
        getRooms
    }
}