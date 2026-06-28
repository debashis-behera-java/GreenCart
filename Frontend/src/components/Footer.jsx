import { assets } from "../assets/greencart/greencart_assets/assets";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="footer" className="bg-gray-900 pt-24 pb-12 mt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-20 border-b border-white/5">
          <div className="space-y-8">
            <img
              src={assets.logo_light}
              alt="GreenCart"
              className="h-8 opacity-90"
            />
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              We bridge the gap between fresh farms and your kitchen table. Our
              mission is to provide the highest quality organic produce with
              unbeatable savings and speed.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <FaFacebookF className="text-white" />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <FaTwitter className="text-white" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <FaInstagram className="text-white" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">
              Culinary Voyage
            </h4>
            <ul className="space-y-4">
              {[
                "Fresh Vegetables",
                "Seasonal Fruits",
                "Dairy & Eggs",
                "Beverages",
                "Snacks & Sweets",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="/all-products"
                    className="text-gray-400 hover:text-emerald-400 text-sm font-medium transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">
              Quick Access
            </h4>
            <ul className="space-y-4">
              {[
                "Master Recipes",
                "Our Story",
                "Shipping Policy",
                "Sell on GreenCart",
                "Contact Hub",
              ].map((item) => (
                <li key={item}>
                  <a
                    href={
                      item === "Sell on GreenCart"
                        ? "/auth"
                        : item === "Master Recipes"
                          ? "/recipes"
                          : "/"
                    }
                    className="text-gray-400 hover:text-emerald-400 text-sm font-medium transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">
              Operational Hub
            </h4>
            <div className="space-y-6">
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">
                  Service Hours
                </p>
                <p className="text-white font-bold text-sm">
                  Mon — Sun: 08:00 - 22:00
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">
                  Headquarters
                </p>
                <p className="text-white font-bold text-sm">
                  Gopibindha, Balasore, Odisha
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">
                  Email
                </p>

                <p className="text-white font-bold text-sm">
                  support@greencart.com
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">
                  Phone
                </p>

                <p className="text-white font-bold text-sm">+91 7846845507</p>
              </div>
              <div className="pt-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                  Live Response Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-xs font-bold">
            © {new Date().getFullYear()} GREENCART TECHNOLOGIES. ALL RIGHTS
            RESERVED.
          </p>
          <div className="flex items-center gap-8">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
              Powered by Freshness
            </span>
            <div className="flex gap-2">
              <span className="px-2 py-1 text-[10px] bg-white/5 text-gray-400 rounded">
                VISA
              </span>

              <span className="px-2 py-1 text-[10px] bg-white/5 text-gray-400 rounded">
                UPI
              </span>

              <span className="px-2 py-1 text-[10px] bg-white/5 text-gray-400 rounded">
                CARD
              </span>

              <span className="px-2 py-1 text-[10px] bg-white/5 text-gray-400 rounded">
                RAZORPAY
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
