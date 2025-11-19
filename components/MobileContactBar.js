'use client';

import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';

const WHATSAPP_NUMBER = '+923281456456';
const DISPLAY_NUMBER = '+92 328 1456456';

export default function MobileContactBar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex shadow-lg">
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-whatsapp-button flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 text-sm font-semibold relative overflow-visible"
      >
        <span className="mobile-whatsapp-icon">
          <FaWhatsapp className="text-lg" />
        </span>
        <span>{DISPLAY_NUMBER}</span>
      </a>
      <a
        href={`tel:${WHATSAPP_NUMBER}`}
        className="mobile-phone-ring-button flex-1 flex items-center justify-center gap-2 bg-[#112D4E] text-white py-3 text-sm font-semibold relative overflow-visible"
      >
        <span className="mobile-phone-icon">
          <FaPhoneAlt className="text-lg" />
        </span>
        <span>{DISPLAY_NUMBER}</span>
      </a>
    </div>
  );
}

