import React from 'react';

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      content: 'The emergency ambulance arrived within 10 minutes of our call. The paramedics were professional and compassionate. They saved my father\'s life during his heart attack.',
      author: 'Sarah Johnson',
      role: 'Patient\'s Daughter',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 2,
      content: 'I needed transportation to my weekly dialysis appointments. The ambulance service has been reliable, always on time, and the staff is friendly and attentive to my needs.',
      author: 'Robert Chen',
      role: 'Regular Patient',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 3,
      content: 'As a healthcare provider, I\'ve worked with many ambulance services. This one stands out for their professionalism, quick response times, and advanced medical equipment.',
      author: 'Dr. Emily Rodriguez',
      role: 'Emergency Physician',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">What Our Patients Say</p>
          <p className="mt-6 text-lg leading-8 text-muted">
            We're proud to provide reliable, compassionate medical transportation services to our community.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex flex-col justify-between rounded-2xl bg-gray-50 p-8 shadow-sm ring-1 ring-gray-200 xl:p-10">
              <div className="mb-10">
                <div className="flex gap-x-3">
                  <img
                    className="h-12 w-12 rounded-full bg-gray-50"
                    src={testimonial.imageUrl}
                    alt=""
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">{testimonial.author}</h3>
                    <p className="text-sm leading-6 text-muted">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="mt-6 text-base leading-7 text-foreground">
                  <p>"{testimonial.content}"</p>
                </blockquote>
              </div>
              <div className="flex justify-end">
                <div className="flex gap-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
