import { Linkedin, Github, Mail, Users } from 'lucide-react'

export function AboutPage() {
  const team = [
    {
      name: 'Your Name',
      role: 'Full-stack Developer',
      bio: 'Building modern hiring experiences with clean UI, secure APIs, and a focus on real-world usability.',
      links: {
        github: 'https://github.com/',
        linkedin: 'https://linkedin.com/',
        email: 'mailto:you@example.com',
      },
    },
  ]

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <section className="container py-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-800 dark:bg-primary-950/40 dark:text-primary-200 border border-primary-100 dark:border-primary-900/50">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">About</span>
          </div>

          <h1 className="mt-5 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            About EthioCareer
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            EthioCareer is a modern hiring platform designed to connect job seekers and employers with better discovery,
            smarter workflows, and a great experience across devices.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Mission</div>
            <div className="mt-2 text-gray-600 dark:text-gray-300">
              Help people find meaningful work and help companies hire faster with trust and transparency.
            </div>
          </div>
          <div className="card">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Values</div>
            <div className="mt-2 text-gray-600 dark:text-gray-300">
              Quality, simplicity, fairness, and privacy-first product design.
            </div>
          </div>
          <div className="card">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">What we build</div>
            <div className="mt-2 text-gray-600 dark:text-gray-300">
              Job discovery, applications, employer tools, dashboards, and secure payments.
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-14">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Meet the Developer</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            This project is built and maintained with care. Customize this section with your real profile and links.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {team.map((p) => (
            <div key={p.name} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">{p.name}</div>
                  <div className="mt-1 text-sm text-primary-700 dark:text-primary-300 font-medium">{p.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={p.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={p.links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={p.links.email}
                    className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">{p.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
