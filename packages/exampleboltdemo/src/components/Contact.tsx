import { Mail, MessageSquare, Calendar, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    useCase: 'dApp Team',
    message: '',
    terms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Validate required fields
      if (!formData.fullName.trim()) {
        throw new Error('Full name is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!formData.company.trim()) {
        throw new Error('Company name is required');
      }
      if (!formData.terms) {
        throw new Error('Please accept the terms to continue');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form on success
      setFormData({
        fullName: '',
        email: '',
        company: '',
        useCase: 'dApp Team',
        message: '',
        terms: false
      });
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
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

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-600 focus:outline-none transition-colors"
                  placeholder="John Smith"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Work Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-600 focus:outline-none transition-colors"
                  placeholder="john@company.com"
                  required
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
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-600 focus:outline-none transition-colors"
                  placeholder="Your Company"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Use Case
                </label>
                <select 
                  name="useCase"
                  value={formData.useCase}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-600 focus:outline-none transition-colors"
                >
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
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-600 focus:outline-none transition-colors"
                placeholder="What operations do you want to automate? What's your current monthly transaction volume?"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-600"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to receive communications about the pilot program and understand that my data will be processed according to the privacy policy.
              </label>
            </div>

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-600 text-sm font-medium">Thank you! We'll be in touch within 24 hours to set up your pilot.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-cyan-600 text-white py-4 rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Mail className="w-5 h-5" />
              {isSubmitting ? 'Submitting...' : 'Request Free Pilot Access'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Questions? Email us at <a href="mailto:sales@cronosai.io" className="text-cyan-600 hover:text-cyan-700 font-medium">sales@cronosai.io</a>
          </p>
        </div>
      </div>
    </section>
  );
}
