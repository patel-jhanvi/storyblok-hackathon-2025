import FreeIcon from "./icons/FreeIcon";


import {
    Wifi,
    Plug,
    Volume2,
    VolumeX,
    Coffee,
    UtensilsCrossed,
    Music,
    BookOpen,
    MapPin,
    Calendar,
    Clock,
    DollarSign,
    User,
    Users,
    Mic,
    Monitor,
    Lightbulb,
    Lock,
    ParkingCircle,
    Accessibility,
    Tag,
    Star,
    Image as ImageIcon,
} from "lucide-react";



export const IconMap: Record<string, any> = {
    // Cafés
    wifi: Wifi,
    power: Plug,
    noise: Volume2,
    quiet: VolumeX,
    seating: Monitor, // fallback until Lucide has chair
    coffee: Coffee,
    food: UtensilsCrossed,
    ambience: Music,
    free: FreeIcon,


    // Study spots
    study: BookOpen,
    hours: Clock,
    lighting: Lightbulb,
    focus: Lock,

    // Meetups
    date: Calendar,
    time: Clock,
    host: User,
    attendees: Users,
    speaker: Mic,
    price: DollarSign,

    // Shared
    location: MapPin,
    parking: ParkingCircle,
    accessibility: Accessibility,
    open: Clock,
    tag: Tag,
    rating: Star,
    photos: ImageIcon,


};
