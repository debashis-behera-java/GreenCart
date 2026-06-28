import { assets, features } from "../assets/greencart/greencart_assets/assets";

export default function FeatureBanner() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="relative overflow-hidden rounded-xl bg-emerald-50">
          <img src={assets.bottom_banner_image} alt="" className="hidden md:block absolute left-6 bottom-0 h-[90%] object-contain pointer-events-none select-none" />
          <div className="md:ml-[300px] px-6 py-8">
            <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-700 mb-4">Why We Are the Best?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-3 bg-white/70 rounded-lg p-3">
                  <img src={f.icon} alt="" className="w-8 h-8" />
                  <div>
                    <div className="font-semibold text-gray-800">{f.title}</div>
                    <div className="text-sm text-gray-600">{f.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

