// frontend/app/privacy/page.js
import { Shield, Cookie, Lock, Eye, Trash2, Download } from 'lucide-react';

export const metadata = {
  title: 'კონფიდენციალურობის პოლიტიკა | SmallMall',
  description: 'მონაცემთა დაცვისა და Cookie-ების გამოყენების პოლიტიკა - SmallMall.ge'
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              კონფიდენციალურობის პოლიტიკა
            </h1>
          </div>
          <p className="text-gray-600">
            განახლებულია: 17 ოქტომბერი, 2025
          </p>
          <p className="text-sm text-gray-500 mt-2">
            SmallMall.ge - საქართველოს საუკეთესო ონლაინ მაღაზია
          </p>
        </div>

        {/* Cookie Policy */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Cookie className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Cookie ფაილები</h2>
          </div>
          
          <p className="text-gray-700 mb-4">
            SmallMall.ge იყენებს Cookie ფაილებს შემდეგი მიზნებისთვის:
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">აუცილებელი Cookie-ები</h3>
              <p className="text-sm text-gray-600">
                ეს Cookie-ები აუცილებელია SmallMall-ის ძირითადი ფუნქციონირებისთვის:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-600">
                <li>ავთენტიფიკაცია და სესიის მართვა</li>
                <li>საყიდლების კალათის შენახვა</li>
                <li>უსაფრთხოების უზრუნველყოფა</li>
                <li>საიტის სტაბილური მუშაობა</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">ფუნქციონალური Cookie-ები</h3>
              <p className="text-sm text-gray-600">
                გამოყენების გამოცდილების გასაუმჯობესებლად:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-600">
                <li>ენის პრეფერენცია</li>
                <li>თემა (ღია/მუქი რეჟიმი)</li>
                <li>ბოლოს ნანახი პროდუქტები</li>
                <li>შენახული ძიების ფილტრები</li>
              </ul>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">ანალიტიკური Cookie-ები</h3>
              <p className="text-sm text-gray-600">
                SmallMall-ის გაუმჯობესებისთვის:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-600">
                <li>გვერდების ნახვები</li>
                <li>მომხმარებლის ქცევა</li>
                <li>პოპულარული პროდუქტები</li>
                <li>საიტის შეცდომების აღმოჩენა</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">მარკეტინგული Cookie-ები</h3>
              <p className="text-sm text-gray-600">
                პერსონალიზებული რეკლამისთვის:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-600">
                <li>Facebook Pixel</li>
                <li>Google Ads</li>
                <li>Retargeting კამპანიები</li>
                <li>სოციალური მედიის ინტეგრაცია</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Collection */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">რა მონაცემებს ვაგროვებთ</h2>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">პირადი ინფორმაცია:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>სახელი და გვარი</li>
                <li>ელექტრონული ფოსტა</li>
                <li>ტელეფონის ნომერი</li>
                <li>მიწოდების მისამართი</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">ტრანზაქციის მონაცემები:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>შეკვეთის ისტორია SmallMall-ზე</li>
                <li>გადახდის ინფორმაცია (დაშიფრული)</li>
                <li>ინვოისები</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">ტექნიკური მონაცემები:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>IP მისამართი</li>
                <li>ბრაუზერის ტიპი და ვერსია</li>
                <li>მოწყობილობის ინფორმაცია</li>
                <li>SmallMall.ge-ზე ვიზიტის დრო</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Usage */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">როგორ ვიყენებთ მონაცემებს</h2>
          </div>

          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>შეკვეთების დამუშავება და მიწოდება</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>მომხმარებელთა მხარდაჭერა</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>SmallMall.ge-ის გაუმჯობესება</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>უსაფრთხოების უზრუნველყოფა</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>მარკეტინგული შეტყობინებები (თანხმობით)</span>
            </li>
          </ul>
        </section>

        {/* User Rights */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">თქვენი უფლებები (GDPR)</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <Eye className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">წვდომის უფლება</h3>
              <p className="text-sm text-gray-600">
                იხილეთ რა პერსონალურ მონაცემებს ვინახავთ თქვენ შესახებ SmallMall-ში
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <Trash2 className="w-5 h-5 text-red-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">წაშლის უფლება</h3>
              <p className="text-sm text-gray-600">
                მოითხოვეთ თქვენი პერსონალური მონაცემების წაშლა
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <Download className="w-5 h-5 text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">გადატანის უფლება</h3>
              <p className="text-sm text-gray-600">
                მიიღეთ თქვენი მონაცემები მანქანაზე წასაკითხ ფორმატში
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <Lock className="w-5 h-5 text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">გასწორების უფლება</h3>
              <p className="text-sm text-gray-600">
                შეცვალეთ არასწორი ან არასრული ინფორმაცია
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">კითხვები?</h2>
          <p className="text-gray-700 mb-3">
            კონფიდენციალურობის პოლიტიკასთან დაკავშირებული კითხვები შეგიძლიათ გამოაგზავნოთ:
          </p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700">
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@smallmall.ge" className="text-blue-600 hover:underline">
                privacy@smallmall.ge
              </a>
            </p>
            <p className="text-gray-700">
              <strong>ტელეფონი:</strong>{' '}
              <a href="tel:+995555123456" className="text-blue-600 hover:underline">
                +995 555 123 456
              </a>
            </p>
            <p className="text-gray-700">
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