import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  Linkedin,
  Twitter,
  Youtube,
  Github,
  Shield,
  Award,
  Users,
  FileText,
  Bell,
  UserCheck,
  Sparkles,
  TrendingUp,
  Heart,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('English');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setEmail('');
  };

  const jobSeekerLinks = [
    { name: 'Browse Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Create Profile', path: '/profile', icon: UserCheck },
    { name: 'Career Advice', path: '/career-advice', icon: TrendingUp },
    { name: 'Salary Guide', path: '/salary-guide', icon: FileText },
    { name: 'Interview Tips', path: '/interview-tips', icon: Award },
    { name: 'Job Alerts', path: '/alerts', icon: Bell }
  ];

  const employerLinks = [
    { name: 'Post Jobs', path: '/employer/post-job', icon: Briefcase },
    { name: 'Browse Candidates', path: '/employer/candidates', icon: Users },
    { name: 'Employer Dashboard', path: '/employer/dashboard', icon: Building },
    { name: 'Pricing', path: '/pricing', icon: Award },
    { name: 'Employer Resources', path: '/employer/resources', icon: FileText },
    { name: 'Hiring Solutions', path: '/employer/solutions', icon: Shield }
  ];

  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Press', path: '/press' },
    { name: 'Blog', path: '/blog' },
    { name: 'Partners', path: '/partners' },
    { name: 'Contact', path: '/contact' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
    { name: 'GDPR Compliance', path: '/gdpr' },
    { name: 'Accessibility', path: '/accessibility' }
  ];

  const socialLinks = [
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/jobportal' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/jobportal' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/c/jobportal' },
    { icon: Github, label: 'GitHub', href: 'https://github.com/jobportal' }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400 relative z-40">
      {/* Trust Badges */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-900/20">
                <Shield className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-white font-semibold">Secure Platform</div>
                <div className="text-sm text-gray-500">ISO 27001 Certified</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-900/20">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-white font-semibold">50K+ Companies</div>
                <div className="text-sm text-gray-500">Trusted Partners</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-900/20">
                <Sparkles className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <div className="text-white font-semibold">95% Success Rate</div>
                <div className="text-sm text-gray-500">AI-Powered Matching</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Brand & Newsletter */}
          <div className="space-y-8">
            {/* Brand */}
            <div>
              <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full" />
                  <div className="relative flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">
                    JobPortal<span className="text-primary-500">Pro</span>
                  </span>
                  <span className="text-sm text-gray-500 font-medium">Where Talent Meets Opportunity</span>
                </div>
              </Link>
              
              <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                We're transforming the hiring experience with intelligent job matching, 
                advanced analytics, and seamless connections between exceptional talent 
                and forward-thinking companies.
              </p>
            </div>

            {/* Newsletter */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary-900/20">
                  <Mail className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Career Insights Newsletter</h3>
                  <p className="text-gray-400 text-sm">Weekly job market intelligence</p>
                </div>
              </div>
              
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email"
                    className="w-full px-4 py-3 pl-12 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  />
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/20 flex items-center justify-center gap-2"
                >
                  <span>Subscribe Now</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </form>
              <p className="mt-3 text-xs text-gray-500">
                By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Right Column - Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Job Seekers */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 pb-3 border-b border-gray-800">
                <UserCheck className="h-5 w-5 text-primary-500" />
                Job Seekers
              </h4>
              <ul className="space-y-3">
                {jobSeekerLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all hover:translate-x-1"
                    >
                      <link.icon className="h-4 w-4 text-primary-500/70 group-hover:text-primary-500" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Employers */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 pb-3 border-b border-gray-800">
                <Building className="h-5 w-5 text-primary-500" />
                Employers
              </h4>
              <ul className="space-y-3">
                {employerLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all hover:translate-x-1"
                    >
                      <link.icon className="h-4 w-4 text-primary-500/70 group-hover:text-primary-500" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Company */}
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-6 pb-3 border-b border-gray-800">Company</h4>
                <div className="grid grid-cols-2 gap-3">
                  {companyLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-6 pb-3 border-b border-gray-800">Contact Info</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-800/50 flex-shrink-0">
                      <Phone className="h-4 w-4 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-white">+251 954 447 749</div>
                      <div className="text-xs text-gray-500">Mon-Fri, 9am-6pm</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-800/50 flex-shrink-0">
                      <Mail className="h-4 w-4 text-primary-500" />
                    </div>
                    <div>
                      <a href="mailto:support@jobportal.com" className="text-white hover:text-primary-400">
                        support@jobportal.com
                      </a>
                      <div className="text-xs text-gray-500">24/7 Support</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-800/50 flex-shrink-0">
                      <MapPin className="h-4 w-4 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-white">Global Headquarters</div>
                      <div className="text-sm text-gray-400">Debre Birhan, Ethiopia</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright & Language */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-sm text-gray-500">
                © {new Date().getFullYear()} JobPortalPro. All rights reserved.
              </div>
              
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary-500" />
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-white border-0 focus:outline-none cursor-pointer"
                >
                  <option value="English">English (Global)</option>
                  <option value="Amharic">አማርኛ</option>
                  <option value="Spanish">Español</option>
                  <option value="French">Français</option>
                </select>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {legalLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Social & App Badge */}
            <div className="flex items-center gap-6">
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-10 w-10 rounded-xl bg-gray-900 hover:bg-primary-600 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/20"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
              
              <div className="hidden md:block h-8 w-px bg-gray-800" />
              
              <div className="flex items-center gap-2 text-sm">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-gray-400">Made with passion in Ethiopia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}