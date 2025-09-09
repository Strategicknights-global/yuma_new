import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Award, Users, Target } from 'lucide-react';

const AboutPage = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'siteConfiguration', 'mainConfig');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConfig(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching about page config:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // Use a default object for siteConfig if config is null, to avoid errors in Footer
  const siteConfigForFooter = config ? { footerInfo: config.footerInfo || {} } : { footerInfo: {} };
  // Or simply pass config directly and let Footer handle defaults if it's robust

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
       

      {/* Conditional rendering for the main content area */}
      {loading ? (
        // Display spinner while loading
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        // Display actual page content once data is loaded
        <>
          {/* Hero Section */}
          <div className="relative bg-orange-700">
            <img
              src={config?.aboutUsBannerImage || '/food_banner.png'}
              alt="Our Team"
              className="w-full h-80 object-cover opacity-40"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
              <h1 className="text-5xl font-extrabold text-white">About Yuma Foods</h1>
              <p className="mt-4 text-xl text-orange-100 max-w-2xl">Freshness, Quality, and Tradition Delivered to Your Doorstep</p>
            </div>
          </div>

          {/* Our Story Section */}
          <section className="py-20 bg-orange-100">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-orange-900 mb-4">Our Story</h2>
              <p className="text-lg text-orange-700 text-center leading-relaxed whitespace-pre-line">
                {config?.aboutUsStory || 'Our story...'}
              </p>
            </div>
          </section>

          {/* Mission & Values */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <Target className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-orange-700">{config?.ourMission || 'Our mission...'}</p>
              </div>
              <div className="flex flex-col items-center">
                <Award className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Our Values</h3>
                <p className="text-orange-700">Quality, authenticity, and customer satisfaction are at the heart of everything we do.</p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Our Community</h3>
                <p className="text-orange-700">We are proud to support local farmers and build a community around healthy, traditional foods.</p>
              </div>
            </div>
          </section>

          {/* Meet the Team */}
          {(config?.teamMembers && config.teamMembers.length > 0) && (
            <section className="py-20 bg-orange-100">
              <div className="max-w-5xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-orange-900 mb-12">Meet the Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {config.teamMembers.map((member, index) => (
                    <div key={index} className="text-center">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
                      />
                      <h4 className="text-lg font-semibold">{member.name}</h4>
                      <p className="text-orange-600">{member.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      
    </div>
  );
};

export default AboutPage;