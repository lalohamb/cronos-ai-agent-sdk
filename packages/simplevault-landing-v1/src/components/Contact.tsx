import { Mail, MessageSquare, Calendar, ArrowRight } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Start Your Free Pilot Today
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our design partner program and be among the first to leverage AI automation for Cronos. Free 30-day pilot with conversion to paid at day 30.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl p-8 md:p-12 border-2 border-gray-200">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Calendar className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Days 0-14</h3>
              <p className="text-sm text-gray-600">Free pilot with flagship demo</p>
            </div>
            <div className="text-center">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <MessageSquare className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Days 15-30</h3>
              <p className="text-sm text-gray-600">Design partner engagement</p>
            </div>
            <div className="text-center">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <ArrowRight className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Day 30+</h3>
              <p className="text-sm text-gray-600">Convert to paid plan</p>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-600 focus:outline-none transition-colors"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Work Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-600 focus:outline-none transition-colors"
                  placeholder="john@company.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-600 focus:outline-none transition-colors"
                  placeholder="Your Company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Use Case
                </label>
                <select className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-600 focus:outline-none transition-colors">
                  <option>dApp Team</option>
                  <option>DeFi Protocol</option>
                  <option>Merchant/PSP</option>
                  <option>DAO Treasury</option>
                  <option>Wallet Provider</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tell us about your automation needs
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-600 focus:outline-none transition-colors"
                placeholder="What operations do you want to automate? What's your current monthly transaction volume?"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-600"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to receive communications about the pilot program and understand that my data will be processed according to the privacy policy.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 text-white py-4 rounded-lg hover:bg-cyan-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Mail className="w-5 h-5" />
              Request Free Pilot Access
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Questions? Email us at <a href="mailto:sales@simplevault.io" className="text-cyan-600 hover:text-cyan-700 font-medium">sales@simplevault.io</a>
          </p>
        </div>
      </div>
    </section>
  );
}
