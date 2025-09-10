interface CardProps {
    title: string;
    description: string;
    image: string;
  }
  
  export default function Card({ title, description, image }: CardProps) {
    return (
      <div className="rounded-lg shadow-md overflow-hidden bg-white border border-gray-200">
        <img src={image} alt={title} className="w-full h-20 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-gray-600 text-sm mt-2">{description}</p>
        </div>
      </div>
    );
  }
  