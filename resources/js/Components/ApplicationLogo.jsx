export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
            {/* Main ambulance body */}
            <rect x="60" y="240" width="340" height="110" rx="20" fill="#FFFFFF" stroke="#4B9CE3" strokeWidth="12" />
            
            {/* Cabin/front of ambulance */}
            <path d="M400 350H370V240C370 240 370 180 430 180V350H400Z" fill="#FFFFFF" stroke="#4B9CE3" strokeWidth="12" />
            
            {/* Windows */}
            <rect x="380" y="200" width="40" height="50" rx="5" fill="#E1F0FF" stroke="#4B9CE3" strokeWidth="6" />
            <rect x="100" y="260" width="60" height="40" rx="5" fill="#E1F0FF" stroke="#4B9CE3" strokeWidth="6" />
            <rect x="180" y="260" width="60" height="40" rx="5" fill="#E1F0FF" stroke="#4B9CE3" strokeWidth="6" />
            <rect x="260" y="260" width="60" height="40" rx="5" fill="#E1F0FF" stroke="#4B9CE3" strokeWidth="6" />
            
            {/* Wheels */}
            <circle cx="120" cy="370" r="40" fill="#333333" stroke="#222222" strokeWidth="6" />
            <circle cx="120" cy="370" r="20" fill="#666666" />
            <circle cx="340" cy="370" r="40" fill="#333333" stroke="#222222" strokeWidth="6" />
            <circle cx="340" cy="370" r="20" fill="#666666" />
            
            {/* Medical cross symbol */}
            <rect x="190" y="180" width="80" height="80" rx="10" fill="#F15B50" />
            <rect x="210" y="190" width="40" height="60" rx="5" fill="#FFFFFF" />
            <rect x="200" y="210" width="60" height="20" rx="5" fill="#FFFFFF" />
            
            {/* Headlights */}
            <circle cx="440" cy="200" r="12" fill="#FFD700" stroke="#4B9CE3" strokeWidth="3" />
            <circle cx="440" cy="330" r="12" fill="#FFD700" stroke="#4B9CE3" strokeWidth="3" />
            
            {/* Emergency lights on top */}
            <rect x="180" y="160" width="100" height="20" rx="5" fill="#4B9CE3" />
            <rect x="190" y="150" width="20" height="10" rx="3" fill="#F15B50" />
            <rect x="220" y="150" width="20" height="10" rx="3" fill="#FFB76B" />
            <rect x="250" y="150" width="20" height="10" rx="3" fill="#F15B50" />
            
            {/* Text: AMBULANCE (reversed on front for mirror readability) */}
            <text x="395" y="240" fontSize="20" fontWeight="bold" fill="#4B9CE3" textAnchor="middle" transform="scale(-1, 1)" dominantBaseline="middle">AMBULANCE</text>
            
            {/* Bottom trim */}
            <rect x="50" y="350" width="360" height="10" rx="3" fill="#4B9CE3" />
        </svg>
    );
}
