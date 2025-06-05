import React from 'react';
import { Link } from '@inertiajs/react';

export function ServiceTypes() {
  const services = [
    {
      id: 1,
      title: 'Emergency Transport',
      description: 'Immediate medical transportation for life-threatening situations. Available 24/7 with rapid response times.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
      ),
      link: '/services/emergency',
      isEmergency: true
    },
    {
      id: 2,
      title: 'Non-Emergency Transport',
      description: 'Scheduled medical transportation for appointments, hospital transfers, and other non-urgent medical needs.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      link: '/services/non-emergency',
      isEmergency: false
    },
    {
      id: 3,
      title: 'Specialized Care Transport',
      description: 'Medical transportation with specialized equipment and trained personnel for patients with specific medical needs.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      ),
      link: '/services/specialized',
      isEmergency: false
    },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Our Services</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Comprehensive Medical Transport Solutions</p>
          <p className="mt-6 text-lg leading-8 text-muted">
            We offer a range of ambulance services to meet various medical transportation needs, from emergencies to scheduled appointments.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.id} className={`flex flex-col ${service.isEmergency ? 'ring-2 ring-primary/20' : ''} rounded-xl p-6 hover:bg-gray-50 transition-all duration-300`}>
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${service.isEmergency ? 'bg-primary' : 'bg-secondary'} text-white`}>
                    {service.icon}
                  </div>
                  {service.title}
                  {service.isEmergency && (
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                      Urgent
                    </span>
                  )}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted">
                  <p className="flex-auto">{service.description}</p>
                  <p className="mt-6">
                    <Link href={service.link} className="text-sm font-semibold leading-6 text-primary">
                      Learn more <span aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
