import Link from "next/link";

const PROMO_CARDS = [
  {
    id: 1,
    title: "Summer Sale! Up to 50% Off",
    image: "https://www.tulipcom.lk/public/dbimages/product/1726832388_pdt_1.jpg", 
    bgColor: "bg-orange-50", // Changed to match theme slightly
    link: "/?category=Headsets"
  },
  {
    id: 2,
    title: "New Keyboards Stock Arrived",
    image: "https://www.tulipcom.lk/public/dbimages/product/1729578834_pdt_1.jpg",
    bgColor: "bg-blue-50",
    link: "/?category=Keyboards"
  },
  {
    id: 3,
    title: "Profectional Style",
    image: "https://www.tulipcom.lk/public/dbimages/product/1726828807_pdt_1.jpg",
    bgColor: "bg-purple-50",
    link: "/?category=Mouse"
  },
  {
    id: 4,
    title: "Best Deals on Monitors",
    image: "https://www.tulipcom.lk/public/dbimages/product/1639843457_pdt_1.jpg",
    bgColor: "bg-yellow-50",
    link: "/?category=Monitors"
  },
  {
    id: 5,
    title: "Upgrade Your Processors",
    image: "https://www.tulipcom.lk/public/dbimages/product/1755259117_pdt_1.jpg",
    bgColor: "bg-green-50",
    link: "/?category=Processors"
  },
];

export default function PromoMarquee() {
  return (
    <div className="relative w-full max-w-full overflow-hidden group mb-8 mt-2">
      <div className="flex w-max">
        {/* Set 1 */}
        <div className="animate-scroll flex gap-4 pr-4">
          {PROMO_CARDS.map((card) => (
            <PromoCard key={card.id} card={card} />
          ))}
        </div>
        {/* Set 2 */}
        <div className="animate-scroll flex gap-4 pr-4" aria-hidden="true">
          {PROMO_CARDS.map((card) => (
            <PromoCard key={card.id + "_dup"} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PromoCard({ card }: { card: any }) {
  return (
    <Link 
      href={card.link}
      className={`flex-shrink-0 relative overflow-hidden rounded-2xl w-64 h-36 sm:w-72 sm:h-40 ${card.bgColor} p-4 flex items-center justify-between hover:shadow-lg transition-all duration-300 border border-white/50 group/card`}
    >
      <div className="flex-1 z-10 pr-2 flex flex-col justify-between h-full">
        <h3 className="font-bold text-base sm:text-lg leading-tight text-slate-800">
          {card.title}
        </h3>
        {/* 👇 Button එක Dark Slate කළා, Hover එක Orange */}
        <span className="w-fit mt-2 px-4 py-1.5 text-xs sm:text-sm font-bold bg-slate-900 text-white rounded-lg shadow-sm group-hover/card:bg-orange-600 transition-colors duration-300">
          Shop Now
        </span>
      </div>
      
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 transform rotate-12 translate-x-3 translate-y-3 group-hover/card:scale-110 transition-transform duration-500">
         <img 
            src={card.image} 
            alt={card.title}
            className="object-cover w-full h-full rounded-xl shadow-md mix-blend-multiply"
            loading="lazy"
         />
      </div>
    </Link>
  );
}