import Link from "next/link";

const PROMO_CARDS = [
  {
    id: 1,
    title: "Summer Sale! Up to 50% Off",
    image: "https://cdn.sanity.io/images/yqd1zell/production/a299cdf14ca121096bf11cb14038f246ea3dc0a5-500x500.png", 
    bgColor: "bg-orange-100", // තද තැඹිලි පාට (Sale එක කැපිලා පේන්න)
    link: "/?category=Headsets"
  },
  {
    id: 2,
    title: "New Keyboards Stock Arrived",
    image: "https://billing.mskcomputers.lk/assets/uploads/e079dcab66f5e3269a1afe05d1b7d513.png",
    bgColor: "bg-slate-100", // Tech look එකට Slate Gray
    link: "/?category=Keyboards"
  },
  {
    id: 3,
    title: "Professional Style",
    image: "https://billing.mskcomputers.lk/assets/uploads/cac77ed95313cbb9f22e7917f484abda.png",
    bgColor: "bg-gray-50", // පිරිසිදු සුදු/අළු පාට
    link: "/?category=Mouse"
  },
  {
    id: 4,
    title: "Best Deals on Monitors",
    image: "https://www.nanotek.lk/storage/products/832/CXF7wbgFYNgrHJyKnFei5ngxcon294UlMTp0wHBP.webp",
    bgColor: "bg-orange-50", // ලා තැඹිලි
    link: "/?category=Monitors"
  },
  {
    id: 5,
    title: "Upgrade Your Processors",
    image: "https://www.nanotek.lk/storage/products/1370/Y2pKaxSZJQY8euxNEP9WiKdKyMKqMIh8r1fb0FoV.webp",
    bgColor: "bg-slate-50", // ලා අළු
    link: "/?category=Processors"
  },
];

export default function PromoMarquee() {
  return (
    <div className="relative w-full max-w-full overflow-hidden group mb-12 mt-4">
      <div className="flex w-max">
        {/* Set 1 */}
        <div className="animate-scroll flex gap-5 pr-5">
          {PROMO_CARDS.map((card) => (
            <PromoCard key={card.id} card={card} />
          ))}
        </div>
        {/* Set 2 */}
        <div className="animate-scroll flex gap-5 pr-5" aria-hidden="true">
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
      className={`flex-shrink-0 relative overflow-hidden rounded-2xl w-72 h-40 sm:w-80 sm:h-44 ${card.bgColor} p-5 flex items-center justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 group/card`}
    >
      {/* Text Content */}
      <div className="flex-1 z-10 pr-2 flex flex-col justify-center h-full gap-3">
        <h3 className="font-extrabold text-lg sm:text-xl leading-tight text-slate-800">
          {card.title}
        </h3>
        
        {/* Button */}
        <span className="w-fit px-4 py-2 text-xs sm:text-sm font-bold bg-slate-900 text-white rounded-lg shadow-sm group-hover/card:bg-orange-600 transition-colors duration-300 flex items-center gap-1">
          Shop Now 
          <svg className="w-3 h-3 group-hover/card:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
      
      {/* Image */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 transform rotate-6 translate-x-4 translate-y-2 group-hover/card:scale-110 group-hover/card:rotate-12 transition-all duration-500">
         <img 
           src={card.image} 
           alt={card.title}
           className="object-contain w-full h-full drop-shadow-lg mix-blend-multiply"
           loading="lazy"
         />
      </div>
    </Link>
  );
}