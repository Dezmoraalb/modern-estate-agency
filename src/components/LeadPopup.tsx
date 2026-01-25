import React, { useState, useEffect } from 'react';

const LeadPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already closed in this session
    const isClosed = sessionStorage.getItem('leadPopupClosed');
    if (isClosed) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 7000); // 7 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('leadPopupClosed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const type = formData.get('type');
    const location = formData.get('location');

    const message = `
🔥 *Нова заявка з сайту (Popup)*

👤 *Ім'я:* ${name}
📞 *Телефон:* ${phone}
🏠 *Тип:* ${type}
📍 *Локація:* ${location}
    `.trim();

    try {
      const response = await fetch(`https://api.telegram.org/bot8499597398:AAFRTprLXuEEQH74o-7XdhhM2oUTMyeHWLc/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: '-5248339490',
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          handleClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#bf953f] to-transparent opacity-70" />

        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Дякуємо!</h3>
              <p className="text-gray-400">Ми зв'яжемося з Вами найближчим часом.</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  Підберемо нерухомість?
                </h3>
                <p className="text-gray-400 text-sm">
                  Залиште контакти і ми запропонуємо варіанти під Ваш запит
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    required
                    type="text"
                    name="name"
                    placeholder="Ваше ім'я"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded focus:border-[#bf953f] focus:outline-none text-white placeholder-white/30 transition-colors"
                  />
                </div>
                <div>
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="Ваш телефон"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded focus:border-[#bf953f] focus:outline-none text-white placeholder-white/30 transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    name="type"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded focus:border-[#bf953f] focus:outline-none text-white transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Квартира" className="bg-[#1a1a1a]">Квартира</option>
                    <option value="Будинок" className="bg-[#1a1a1a]">Будинок</option>
                    <option value="Комерція" className="bg-[#1a1a1a]">Комерція</option>
                    <option value="Земля" className="bg-[#1a1a1a]">Земля</option>
                  </select>

                  <select 
                    name="location"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded focus:border-[#bf953f] focus:outline-none text-white transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Ірпінь" className="bg-[#1a1a1a]">Ірпінь</option>
                    <option value="Буча" className="bg-[#1a1a1a]">Буча</option>
                    <option value="Київ" className="bg-[#1a1a1a]">Київ</option>
                    <option value="Область" className="bg-[#1a1a1a]">Область</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] rounded font-bold text-white uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? 'Надсилання...' : 'Отримати пропозиції'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadPopup;
