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
    Sun,
    PawPrint,
} from "lucide-react";



export const IconMap: Record<string, any> = {
    // Cafés
    wifi: Wifi,
    power: Plug,
    power_outlets: Plug,
    noise: Volume2,
    noise_level: Volume2,
    seating_capacity: Users,
    quiet: VolumeX,
    seating: Monitor, // fallback until Lucide has chair
    coffee: Coffee,
    food: UtensilsCrossed,
    ambience: Music,
    free: FreeIcon,

    outdoor_seating: Sun, // new
    pet_friendly: PawPrint,
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
