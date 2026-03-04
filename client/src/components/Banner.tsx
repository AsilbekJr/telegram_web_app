export default function Banner() {
  return (
    <div className="px-4 py-2">
      <div className="relative w-full h-36 sm:h-48 rounded-2xl overflow-hidden shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800" 
          alt="Sale Banner" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand/90 to-black/20 flex flex-col justify-center p-6">
          <h2 className="text-white text-2xl sm:text-3xl font-black mb-1">
            Katta<br/>Chegirmalar
          </h2>
          <p className="text-white/90 text-sm font-medium">Barcha elektronikaga 50% gacha</p>
          <div className="mt-3">
             <span className="inline-block bg-white text-brand text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                Xarid qilish
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}
