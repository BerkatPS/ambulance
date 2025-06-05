import React, { useState } from 'react';

export function FAQ() {
  const faqs = [
    {
      id: 1,
      question: 'How quickly will an ambulance arrive after I request one?',
      answer: 'For emergency situations, our average response time is 8-12 minutes, depending on your location and traffic conditions. When you request an emergency ambulance, our dispatcher will immediately locate and assign the closest available unit to reach you as quickly as possible.',
    },
    {
      id: 2,
      question: 'What information do I need to provide when booking an emergency ambulance?',
      answer: 'When booking an emergency ambulance, you\'ll need to provide: your full name, contact number, current location with as much detail as possible, the nature of the emergency, and a brief description of the patient\'s condition or symptoms. The more information you can provide, the better prepared our medical team will be.',
    },
    {
      id: 3,
      question: 'How do I track my ambulance once it\'s been dispatched?',
      answer: 'Once an ambulance has been dispatched to your location, you\'ll receive a confirmation with a tracking link via SMS and email (if provided). This link allows you to see the real-time location of the ambulance and estimated time of arrival. You can also call our dispatch center for updates.',
    },
    {
      id: 4,
      question: 'What types of payment methods do you accept?',
      answer: 'We accept various payment methods including credit/debit cards, bank transfers, and major insurance providers. For emergency services, payment is typically handled after the service is provided. For scheduled non-emergency transport, payment can be made at the time of booking or upon service completion.',
    },
    {
      id: 5,
      question: 'Are your ambulances equipped with advanced medical equipment?',
      answer: 'Yes, all our ambulances are fully equipped with advanced life support equipment including cardiac monitors, defibrillators, ventilators, and a comprehensive range of medications. Our emergency vehicles are regularly inspected and maintained to ensure all equipment is in optimal working condition.',
    },
    {
      id: 6,
      question: 'Do you provide inter-hospital transfers?',
      answer: 'Yes, we provide inter-hospital transfers for patients who need to be moved from one healthcare facility to another. These transfers can be scheduled in advance and are handled by our trained medical staff to ensure patient safety and comfort throughout the journey.',
    },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">FAQs</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Frequently Asked Questions</p>
          <p className="mt-6 text-lg leading-8 text-muted">
            Get answers to common questions about our ambulance services.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-3xl divide-y divide-gray-200">
          <dl className="space-y-6 divide-y divide-gray-200">
            {faqs.map((faq) => (
              <div key={faq.id} className="pt-6">
                <dt>
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-start justify-between text-left text-foreground"
                  >
                    <span className="text-lg font-semibold leading-7">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      {openFaq === faq.id ? (
                        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                        </svg>
                      ) : (
                        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                        </svg>
                      )}
                    </span>
                  </button>
                </dt>
                {openFaq === faq.id && (
                  <dd className="mt-2 pr-12">
                    <p className="text-base leading-7 text-muted">{faq.answer}</p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
