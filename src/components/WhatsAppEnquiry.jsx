import { MessageCircle } from 'lucide-react';
import { trackPricingEvent } from '../firebase';
import { whatsappEnquiryUrl } from '../salesOffer';

const eventsBySource = { home: 'whatsappHome', pricing: 'whatsappPricing', 'service-page': 'whatsappService' };

export default function WhatsAppEnquiry({ planName, source, className }) {
  return (
    <a
      href={whatsappEnquiryUrl(planName)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackPricingEvent(eventsBySource[source])}
    >
      <MessageCircle size={16} aria-hidden="true" />
      Chat on WhatsApp
    </a>
  );
}
