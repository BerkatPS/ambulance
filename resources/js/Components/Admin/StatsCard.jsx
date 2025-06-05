import React from 'react';

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'increase', 
  timePeriod = 'from last month', 
  bgColor = 'bg-white' 
}) {
  return (
    <div className={`${bgColor} overflow-hidden shadow-sm rounded-xl`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-xl ${
              changeType === 'increase' ? 'bg-success-100 text-success-600' : 
              changeType === 'decrease' ? 'bg-danger-100 text-danger-600' : 
              'bg-medical-gray-100 text-medical-gray-600'
            }`}>
              {icon || (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-medical-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-xl font-semibold text-medical-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      
      {change && (
        <div className="bg-medical-gray-50 px-5 py-3">
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${
              changeType === 'increase' ? 'text-success-500' : 
              changeType === 'decrease' ? 'text-danger-500' : 
              'text-medical-gray-500'
            }`}>
              {changeType === 'increase' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              ) : changeType === 'decrease' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-2 flex items-baseline text-sm font-medium">
              <span className={changeType === 'increase' ? 'text-success-600' : changeType === 'decrease' ? 'text-danger-600' : 'text-medical-gray-600'}>
                {change}
              </span>
              <span className="ml-1 text-medical-gray-400">{timePeriod}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
