import { Mail, Phone, MapPin, Send } from 'lucide-react'

export function ContactPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <section className="container py-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-800 dark:bg-primary-950/40 dark:text-primary-200 border border-primary-100 dark:border-primary-900/50">
            <span className="text-sm font-medium">Contact</span>
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Have a question, feedback, or want a custom plan for your company? Send us a message.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">First name</label>
                  <input className="input mt-2" placeholder="Your first name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Last name</label>
                  <input className="input mt-2" placeholder="Your last name" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                <input className="input mt-2" placeholder="you@example.com" type="email" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Message</label>
                <textarea className="input mt-2 min-h-32" placeholder="Tell us what you need..." />
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-lg text-sm font-semibold transition-colors"
              >
                <Send className="h-4 w-4" />
                Send message
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                This is a UI-only form for now. If you want, I can connect it to your backend email endpoint.
              </p>
            </form>
          </div>

          <div className="card">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Contact details</div>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-9 w-9 rounded-lg bg-primary-600/10 dark:bg-primary-500/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary-700 dark:text-primary-300" />
                </div>
                <div>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">Email</div>
                  <div className="text-gray-600 dark:text-gray-300">support@ethiocareer.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-9 w-9 rounded-lg bg-primary-600/10 dark:bg-primary-500/10 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary-700 dark:text-primary-300" />
                </div>
                <div>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">Phone</div>
                  <div className="text-gray-600 dark:text-gray-300">+251 954 447 749</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-9 w-9 rounded-lg bg-primary-600/10 dark:bg-primary-500/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary-700 dark:text-primary-300" />
                </div>
                <div>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">Location</div>
                  <div className="text-gray-600 dark:text-gray-300">Debre Birhan, Ethiopia</div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Support hours</div>
              <div className="mt-2 text-gray-600 dark:text-gray-300">Mon–Fri, 9am–6pm</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
