import { Stethoscope, Scissors, Heart, Home, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    icon: Stethoscope,
    title: "Veterinary Care",
    description: "Professional medical care from certified veterinarians",
    features: ["Health checkups", "Vaccinations", "Emergency care"],
  },
  {
    icon: Scissors,
    title: "Pet Grooming",
    description: "Professional grooming services to keep your pet looking great",
    features: ["Bathing & brushing", "Nail trimming", "Styling"],
  },
  {
    icon: Heart,
    title: "Pet Training",
    description: "Expert training programs for pets of all ages",
    features: ["Obedience training", "Behavioral correction", "Puppy classes"],
  },
  {
    icon: Home,
    title: "Pet Boarding",
    description: "Safe and comfortable boarding when you're away",
    features: ["24/7 supervision", "Play time", "Comfortable rooms"],
  },
];

export function Services() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive pet care services to keep your furry friends happy and healthy
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="border border-blue-100 rounded-lg p-6 text-center transition-shadow hover:shadow-xl"
              >
                {/* Icon */}
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-blue-600">
                  <Icon className="text-blue-600 group-hover:text-white" size={32} />
                </div>

                <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mt-2">{service.description}</p>

                {/* Features */}
                <ul className="mt-4 space-y-2 text-gray-500">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-center gap-2 text-sm"
                    >
                      <Star size={12} fill="#3b82f6" color="#3b82f6" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need Professional Pet Care?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Connect with our network of certified veterinarians and pet care professionals. Book an appointment today and give your pet the care they deserve.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/veterinary')}
              className="bg-blue-600 text-white px-6 py-3 font-semibold rounded-lg flex items-center justify-center hover:bg-blue-700 transition"
            >
              <Stethoscope size={20} className="mr-2" /> Veterinary Service
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
