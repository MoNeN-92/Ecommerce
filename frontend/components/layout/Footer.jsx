// frontend/components/layout/Footer.jsx
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-blue-400">SmallMall</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              საუკეთესო ონლაინ შოპინგი საქართველოში. 
              ხარისხიანი პროდუქტები მყისიერი მიწოდებით.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com/smallmall" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com/smallmall.ge" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com/smallmall" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky-500 transition"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold mb-4 text-sm">სწრაფი ლინკები</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition">
                  მთავარი
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-slate-400 hover:text-white transition">
                  პროდუქტები
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-slate-400 hover:text-white transition">
                  კალათა
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-slate-400 hover:text-white transition">
                  პროფილი
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-semibold mb-4 text-sm">ინფორმაცია</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition">
                  კონფიდენციალურობა
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white transition">
                  მომსახურების პირობები
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition">
                  ჩვენს შესახებ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition">
                  კონტაქტი
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-semibold mb-4 text-sm">კონტაქტი</h5>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>თბილისი, საქართველო</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+995555123456" className="hover:text-white transition">
                  +995 555 123 456
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@smallmall.ge" className="hover:text-white transition">
                  info@smallmall.ge
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <a 
                href="https://smallmall.ge" 
                className="text-blue-400 hover:text-blue-300 transition text-sm font-medium"
              >
                www.smallmall.ge
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
            <p>© 2025 SmallMall. ყველა უფლება დაცულია</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white transition">
                კონფიდენციალურობა
              </Link>
              <Link href="/terms" className="hover:text-white transition">
                პირობები
              </Link>
              <a 
                href="https://smallmall.ge" 
                className="hover:text-white transition"
              >
                SmallMall.ge
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}