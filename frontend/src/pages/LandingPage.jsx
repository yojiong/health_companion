import { Link } from 'react-router-dom';
import { Activity, Heart, Shield, Clock, Users, Bell, ArrowRight, Cpu, Wifi, Battery } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="glass fixed w-full z-50 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Activity className="w-8 h-8 text-medical-cyan" />
              <span className="text-xl font-bold text-white">Health Companion</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/login" className="text-white hover:text-medical-cyan transition">Login</Link>
              <Link to="/register" className="gradient-bg text-white px-6 py-2 rounded-full hover:opacity-90 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-medical-cyan/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-medical-green/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-medical-cyan/20 border border-medical-cyan/30 rounded-full px-4 py-2 mb-6">
                <Cpu className="w-4 h-4 text-medical-cyan" />
                <span className="text-medical-cyan text-sm">AI-Powered Healthcare Platform</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Intelligent Health
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-medical-cyan to-medical-green">
                  Companion
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Advanced AI monitoring for Dementia and Heart Failure patients.
                Real-time health tracking, medication reminders, and instant alerts
                for caregivers and medical institutions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register" className="gradient-bg text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition flex items-center justify-center space-x-2 pulse-glow">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="glass text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition flex items-center justify-center space-x-2">
                  <span>View Demo</span>
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-gray-400 text-sm">Active Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-gray-400 text-sm">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-gray-400 text-sm">Monitoring</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="glass rounded-3xl p-8 float">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Smart Health Band</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-medical-green rounded-full animate-pulse"></div>
                    <span className="text-medical-green text-sm">Connected</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-500/20 rounded-2xl p-4 text-center">
                    <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">72</div>
                    <div className="text-gray-400 text-sm">Heart Rate</div>
                  </div>
                  <div className="bg-blue-500/20 rounded-2xl p-4 text-center">
                    <Activity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">98%</div>
                    <div className="text-gray-400 text-sm">SpO2</div>
                  </div>
                  <div className="bg-green-500/20 rounded-2xl p-4 text-center">
                    <Wifi className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">5G</div>
                    <div className="text-gray-400 text-sm">Network</div>
                  </div>
                  <div className="bg-purple-500/20 rounded-2xl p-4 text-center">
                    <Battery className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-gray-400 text-sm">Battery</div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className="text-medical-green text-sm font-semibold">All Normal</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-medical-cyan to-medical-green h-2 rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Comprehensive Health Monitoring</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Advanced sensors and AI algorithms provide real-time health monitoring
              with instant alerts for abnormal conditions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Heart Rate Monitoring',
                description: 'Continuous ECG monitoring with instant alerts for abnormal heart rhythms.',
                color: 'red'
              },
              {
                icon: <Activity className="w-8 h-8" />,
                title: 'Blood Oxygen Tracking',
                description: 'SpO2 monitoring essential for heart failure patients.',
                color: 'blue'
              },
              {
                icon: <Bell className="w-8 h-8" />,
                title: 'Smart Alerts',
                description: 'AI-powered alerts notify caregivers instantly.',
                color: 'green'
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Medication Reminders',
                description: 'Never miss a dose with smart scheduling.',
                color: 'purple'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Care Team Coordination',
                description: 'Share health data with family and medical teams.',
                color: 'cyan'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Privacy First',
                description: 'HIPAA compliant with end-to-end encryption.',
                color: 'orange'
              }
            ].map((feature, index) => (
              <div key={index} className="glass rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}-500/20 text-${feature.color}-400 mb-4 flex items-center justify-center`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Healthcare?</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare providers and families who trust
              Health Companion for better patient outcomes.
            </p>
            <Link to="/register" className="gradient-bg text-white px-12 py-4 rounded-full font-semibold hover:opacity-90 transition inline-flex items-center space-x-2">
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 Intelligent Health Companion. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;