import React, { useState, useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';

export default function HeroSection() {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [ambulancePosition, setAmbulancePosition] = useState(0);

  const { data, setData, post, processing, errors } = useForm({
    patient_name: '',
    contact_number: '',
    location: '',
    emergency_type: '',
    description: '',
  });

  // Animation for ambulance movement
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setAmbulancePosition((prevPosition) => {
        // Reset position when it goes off-screen
        if (prevPosition > 120) return 90;
        return prevPosition + 0.2;
      });
    }, 50);

    return () => clearInterval(animationInterval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('emergency-booking.store'), {
      onSuccess: () => setShowEmergencyModal(false),
    });
  };

  return (
    <div className="relative isolate overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50 via-white to-white"></div>

      {/* Main content area */}
      <div className="relative z-10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left column: Text content */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Emergency Medical Transportation When You Need It Most
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted">
                Our ambulance service provides 24/7 emergency and non-emergency medical transportation with a focus on safety, reliability, and compassionate care.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <button
                  onClick={() => setShowEmergencyModal(true)}
                  className="rounded-md bg-primary px-6 py-4 text-lg font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary animate-pulse"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                    </svg>
                    Emergency Booking
                  </span>
                </button>
                <Link href="/services" className="text-sm font-semibold leading-6 text-foreground">
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>

              {/* Service highlights with icons */}
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 text-primary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">24/7 Availability</h3>
                  <p className="text-sm text-gray-600">Round-the-clock emergency response</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 text-primary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">GPS Tracking</h3>
                  <p className="text-sm text-gray-600">Real-time ambulance location</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 text-primary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Certified Medics</h3>
                  <p className="text-sm text-gray-600">Professional medical staff</p>
                </div>
              </div>
            </div>

            {/* Right column: Ambulance animation */}
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0">
                <div className="road-scene h-full w-full">
                  {/* Scenery: Sky and buildings */}
                  <div className="sky absolute inset-0 h-2/3 bg-gradient-to-b from-blue-400 to-blue-100"></div>

                  {/* Buildings in background */}
                  <div className="buildings absolute bottom-1/3 left-0 right-0">
                    <div className="building building-1"></div>
                    <div className="building building-2"></div>
                    <div className="building building-3"></div>
                    <div className="building building-4"></div>
                    <div className="building building-5"></div>
                  </div>

                  {/* Road with moving lines */}
                  <div className="road absolute bottom-0 left-0 right-0 h-1/3 bg-gray-700">
                    <div className="road-middle"></div>
                    <div className="road-side road-side-top"></div>
                    <div className="road-side road-side-bottom"></div>
                  </div>

                  {/* Ambulance SVG */}
                  <div
                    className="ambulance-wrapper absolute"
                    style={{
                      bottom: '15%',
                      left: `${ambulancePosition}%`,
                      transform: 'translateY(-15%)',
                      filter: 'drop-shadow(0px 10px 8px rgba(0, 0, 0, 0.3))'
                    }}
                  >
                    <div className="ambulance relative h-[120px] w-[240px]">
                      <img
                        src="/images/ambulance.svg"
                        alt="Ambulance"
                        className="w-full h-full object-contain ambulance-bounce"
                      />

                      {/* Flashing emergency lights (separate for better animation) */}
                      <div className="emergency-lights">
                        <div className="emergency-light light-red"></div>
                        <div className="emergency-light light-blue"></div>
                      </div>

                      {/* Wheel animations */}
                      <div className="wheel front-wheel"></div>
                      <div className="wheel back-wheel"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Booking Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 text-center">
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" onClick={() => setShowEmergencyModal(false)}></div>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">Emergency Booking</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Please provide the following information for immediate assistance. Our team will contact you right away.
                      </p>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="patient_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      id="patient_name"
                      value={data.patient_name}
                      onChange={e => setData('patient_name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="John Doe"
                      required
                    />
                    {errors.patient_name && <div className="text-red-500 text-xs mt-1">{errors.patient_name}</div>}
                  </div>
                  <div>
                    <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      id="contact_number"
                      value={data.contact_number}
                      onChange={e => setData('contact_number', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                    {errors.contact_number && <div className="text-red-500 text-xs mt-1">{errors.contact_number}</div>}
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Current Location</label>
                    <input
                      type="text"
                      id="location"
                      value={data.location}
                      onChange={e => setData('location', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="123 Main St, City, State"
                      required
                    />
                    {errors.location && <div className="text-red-500 text-xs mt-1">{errors.location}</div>}
                  </div>
                  <div>
                    <label htmlFor="emergency_type" className="block text-sm font-medium text-gray-700">Emergency Type</label>
                    <select
                      id="emergency_type"
                      value={data.emergency_type}
                      onChange={e => setData('emergency_type', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      required
                    >
                      <option value="">Select emergency type</option>
                      <option value="Medical Emergency">Medical Emergency</option>
                      <option value="Accident">Accident</option>
                      <option value="Cardiac Arrest">Cardiac Arrest</option>
                      <option value="Respiratory Distress">Respiratory Distress</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.emergency_type && <div className="text-red-500 text-xs mt-1">{errors.emergency_type}</div>}
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Brief Description</label>
                    <textarea
                      id="description"
                      value={data.description}
                      onChange={e => setData('description', e.target.value)}
                      rows="3"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="Please provide a brief description of the emergency situation"
                    ></textarea>
                    {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      disabled={processing}
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {processing ? 'Processing...' : 'Request Emergency Ambulance'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setShowEmergencyModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced CSS for animations */}
      <style jsx>{`
        /* Road scene styles */
        .road-scene {
          perspective: 1000px;
        }

        /* Buildings */
        .buildings {
          display: flex;
          justify-content: space-around;
          height: 100px;
          z-index: 1;
        }

        .building {
          width: 60px;
          height: 120px;
          background-color: #6b7280;
          position: relative;
          margin: 0 5px;
          box-shadow: 0 0 15px rgba(0,0,0,0.2);
        }

        .building-1 { height: 140px; width: 70px; }
        .building-2 { height: 160px; width: 60px; }
        .building-3 { height: 180px; width: 80px; }
        .building-4 { height: 150px; width: 65px; }
        .building-5 { height: 130px; width: 75px; }

        /* Building windows */
        .building::after {
          content: '';
          position: absolute;
          top: 10%;
          left: 10%;
          right: 10%;
          bottom: 10%;
          background: repeating-conic-gradient(#444 0% 25%, #666 0% 50%);
          opacity: 0.6;
          background-size: 10px 10px;
        }

        /* Road styles */
        .road {
          transform: rotateX(60deg);
          position: relative;
          overflow: hidden;
        }

        .road-middle {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 4px;
          background: #ffffff;
          margin-top: -2px;
          background: repeating-linear-gradient(
            90deg,
            #ffffff,
            #ffffff 20px,
            transparent 20px,
            transparent 40px
          );
          animation: moveRoad 1s linear infinite;
        }

        @keyframes moveRoad {
          0% { background-position: 0 0; }
          100% { background-position: -40px 0; }
        }

        .road-side {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: #ffdd00;
        }

        .road-side-top {
          top: 20%;
        }

        .road-side-bottom {
          bottom: 20%;
        }

        /* Ambulance animations */
        .ambulance-bounce {
          animation: bounce 1s ease-in-out infinite alternate;
        }

        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-5px); }
        }

        /* Emergency lights */
        .emergency-lights {
          position: absolute;
          top: 35px;
          left: 80px;
          width: 80px;
          height: 10px;
          z-index: 5;
        }

        .emergency-light {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .light-red {
          left: 10px;
          background-color: #ff4136;
          box-shadow: 0 0 10px 5px rgba(255, 65, 54, 0.7);
          animation: flashRed 0.5s linear infinite alternate;
        }

        .light-blue {
          left: 30px;
          background-color: #0074D9;
          box-shadow: 0 0 10px 5px rgba(0, 116, 217, 0.7);
          animation: flashBlue 0.5s linear infinite alternate;
        }

        @keyframes flashRed {
          0% { opacity: 1; box-shadow: 0 0 15px 5px rgba(255, 65, 54, 0.8); }
          100% { opacity: 0.4; box-shadow: 0 0 5px 2px rgba(255, 65, 54, 0.3); }
        }

        @keyframes flashBlue {
          0% { opacity: 0.4; box-shadow: 0 0 5px 2px rgba(0, 116, 217, 0.3); }
          100% { opacity: 1; box-shadow: 0 0 15px 5px rgba(0, 116, 217, 0.8); }
        }

        /* Wheel animations */
        .wheel {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #333;
          border: 3px solid #666;
          bottom: 0;
          animation: rotate 0.5s linear infinite;
        }

        .front-wheel {
          right: 45px;
          bottom: 5px;
        }

        .back-wheel {
          left: 45px;
          bottom: 5px;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .ambulance-wrapper {
            transform: scale(0.7) translateY(-15%);
          }

          .buildings {
            height: 70px;
          }

          .building {
            height: 90px;
            width: 40px;
          }
        }
      `}</style>
    </div>
  );
}
