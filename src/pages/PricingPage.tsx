import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PricingPage() {
  const tiers = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Best for getting started and exploring the platform.',
      features: ['Browse jobs', 'Create profile', 'Basic applications', 'Email notifications'],
      cta: { label: 'Create account', to: '/register' },
      highlighted: false,
    },
    {
      name: 'Pro',
      price: 'ETB 299 / mo',
      description: 'For active job seekers who want faster results.',
      features: ['Priority applications', 'Unlimited job alerts', 'CV templates', 'Premium support'],
      cta: { label: 'Go to Subscription', to: '/subscription' },
      highlighted: true,
    },
    {
      name: 'Business',
      price: 'Custom',
      description: 'For employers hiring at scale with analytics and workflow tools.',
      features: ['Employer dashboard', 'Applicant pipeline', 'Team access', 'Custom integrations'],
      cta: { label: 'Contact Sales', to: '/contact' },
      highlighted: false,
    },
  ]

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <section className="container py-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-800 dark:bg-primary-950/40 dark:text-primary-200 border border-primary-100 dark:border-primary-900/50">
            <span className="text-sm font-medium">Pricing</span>
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Simple plans, clear value</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Choose the plan that fits your goals. Upgrade or cancel anytime.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={
                (t.highlighted
                  ? 'border-primary-400/60 dark:border-primary-600/60 shadow-lg shadow-primary-500/10'
                  : 'border-gray-200 dark:border-gray-800') +
                ' card relative overflow-hidden'
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">{t.name}</div>
                  <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{t.price}</div>
                </div>
                {t.highlighted && (
                  <div className="px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold">Most Popular</div>
                )}
              </div>

              <p className="mt-4 text-gray-600 dark:text-gray-300">{t.description}</p>

              <div className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 rounded-full bg-primary-600/10 dark:bg-primary-500/10 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-primary-700 dark:text-primary-300" />
                    </div>
                    <div className="text-gray-700 dark:text-gray-200">{f}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  to={t.cta.to}
                  className={
                    (t.highlighted
                      ? 'bg-primary-600 hover:bg-primary-700 text-white border-primary-600 hover:border-primary-700'
                      : 'bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800') +
                    ' inline-flex w-full items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold transition-colors border'
                  }
                >
                  {t.cta.label}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
