import { ref } from "vue"
import { Building } from "../models/building"

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

    return {
        getBuildings
    }
}