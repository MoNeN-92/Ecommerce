// frontend/app/terms/page.js
import { FileText, AlertCircle, Shield, Package } from 'lucide-react';

export const metadata = {
  title: 'მომსახურების პირობები | SmallMall',
  description: 'ვებსაიტის გამოყენების წესები და პირობები - SmallMall.ge'
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              მომსახურების პირობები
            </h1>
          </div>
          <p className="text-gray-600">
            განახლებულია: 17 ოქტომბერი, 2025
          </p>
          <p className="text-sm text-gray-500 mt-2">
            SmallMall.ge - საქართველოს საუკეთესო ონლაინ მაღაზია
          </p>
        </div>

        {/* Acceptance */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. პირობების მიღება</h2>
          <p className="text-gray-700 mb-3">
            SmallMall.ge-ზე შესვლით და გამოყენებით თქვენ ეთანხმებით ამ მომსახურების პირობებს. 
            თუ არ ეთანხმებით რომელიმე პუნქტს, გთხოვთ არ გამოიყენოთ ჩვენი საიტი.
          </p>
        </section>

        {/* Rest of Terms content... */}
        {/* (Same structure as before, just with SmallMall branding) */}
        
        {/* Contact at end */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">კონტაქტი</h2>
          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:info@smallmall.ge" className="text-blue-600 hover:underline">
                info@smallmall.ge
              </a>
            </p>
            <p>
              <strong>ტელეფონი:</strong> +995 555 123 456
            </p>
            <p>
              <strong>მისამართი:</strong> თბილისი, საქართველო
            </p>
            <p>
              <strong>ვებსაიტი:</strong>{' '}
              <a href="https://smallmall.ge" className="text-blue-600 hover:underline">
                www.smallmall.ge
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}