import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaWhatsapp,
} from 'react-icons/fa';

{/* socials */}
<div className="flex flex-col gap-6 md:items-end">

  <h3 className="text-white font-semibold tracking-wide text-sm uppercase">
    Socials
  </h3>

  <div className="flex items-center gap-4 flex-wrap">

    <a
      href="https://www.facebook.com/profile.php?id=61558472124147"
      target="_blank"
      rel="noopener noreferrer"
      className="w-11 h-11 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-gray-500 hover:text-blue-400 hover:border-blue-400/30 transition"
    >
      <FaFacebookF size={18} />
    </a>

    <a
      href="https://github.com/NanoKillX"
      target="_blank"
      rel="noopener noreferrer"
      className="w-11 h-11 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition"
    >
      <FaGithub size={18} />
    </a>

    <a
      href="https://www.instagram.com/nanokillx/"
      target="_blank"
      rel="noopener noreferrer"
      className="w-11 h-11 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-gray-500 hover:text-pink-400 hover:border-pink-400/30 transition"
    >
      <FaInstagram size={18} />
    </a>

    <a
      href="https://api.whatsapp.com/send/?phone=94740356525&text&type=phone_number&app_absent=0"
      target="_blank"
      rel="noopener noreferrer"
      className="w-11 h-11 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-gray-500 hover:text-green-400 hover:border-green-400/30 transition"
    >
      <FaWhatsapp size={18} />
    </a>

  </div>
</div>
