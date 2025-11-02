'use client';

import { FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp, FaSignInAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function FloatingSocialBar() {
  const socialLinks = [
    {
      icon: FaSignInAlt,
      href: '/login',
      label: 'Login',
      bgColor: 'bg-[#1a2b5c]',
      hoverColor: 'hover:bg-[#0d1b2a]',
    },
    {
      icon: FaWhatsapp,
      href: 'https://api.whatsapp.com/send/?phone=923281456456&text=Hello+Welcome%2C%0D%0AI+am+interesting+in++Honda+Civic&type=phone_number&app_absent=0',
      label: 'WhatsApp',
      bgColor: 'bg-[#25D366]',
      hoverColor: 'hover:bg-[#20BA5A]',
    },
    {
      icon: FaTwitter,
      href: 'https://twitter.com/convoytravels',
      label: 'Twitter',
      bgColor: 'bg-[#1DA1F2]',
      hoverColor: 'hover:bg-[#1a91da]',
    },
    {
      icon: FaLinkedinIn,
      href: 'https://www.linkedin.com/company/convoytravels',
      label: 'LinkedIn',
      bgColor: 'bg-[#0077B5]',
      hoverColor: 'hover:bg-[#006399]',
    },
    {
      icon: FaFacebookF,
      href: 'https://www.facebook.com/convoytravels',
      label: 'Facebook',
      bgColor: 'bg-[#1877F2]',
      hoverColor: 'hover:bg-[#166fe5]',
    },
  ];

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 mr-[5px] flex flex-col gap-2 sm:gap-3">
      {socialLinks.map((social, index) => (
        <Link
          key={index}
          href={social.href}
          target={social.href.startsWith('http') ? '_blank' : '_self'}
          rel={social.href.startsWith('http') ? 'noopener noreferrer' : ''}
          className={`
            ${social.bgColor} 
            ${social.hoverColor}
            text-white 
            w-10 
            h-10 
            sm:w-12 
            sm:h-12 
            rounded-full 
            flex 
            items-center 
            justify-center 
            shadow-lg 
            hover:shadow-xl 
            transition-all 
            duration-300 
            hover:scale-110 
            group
            relative
          `}
          aria-label={social.label}
        >
          <span className="group-hover:scale-110 transition-transform duration-300">
            <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
          {/* Tooltip - Hidden on mobile, visible on hover */}
          <span className="absolute right-full mr-3 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-900 text-white text-xs sm:text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none hidden sm:block">
            {social.label}
          </span>
        </Link>
      ))}
    </div>
  );
}

