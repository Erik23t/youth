export default function DoctorSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-12 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <img
            src="https://imagens.zylumia.com/cyperus-.png"
            alt="Dermatologist"
            width="800"
            height="600"
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 leading-tight">
            Clinically proven. Dermatologist recommended. Over 50,000 satisfied customers.
          </h2>
          <div className="w-16 h-px bg-gray-300 mb-8"></div>
          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <p>
              Our advanced Cyperus Rotundus formula has been clinically studied for its hair growth inhibiting properties, making it the natural alternative healthcare professionals actually recommend to their patients.
            </p>
            <p>
              Unlike harsh chemicals or expensive laser treatments, Zylumia works gently with your skin's natural processes to gradually slow hair growth, without irritation or side effects. Thousands of women have already discovered smoother skin and longer intervals between hair removal sessions.
            </p>
            <p>
              Join the growing community of confident women who have chosen to use professional-grade hair inhibitors at home.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
