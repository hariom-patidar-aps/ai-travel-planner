export default function Card({
  title,
  subtitle,
  children,
  icon,
}) {
  return (
    <section className="glass card rounded-3xl p-8 mb-8 relative overflow-hidden">

      {/* Decorative Glow */}

      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-cyan-400/20 blur-3xl"></div>

      {/* Header */}

      {title && (
        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-3xl font-bold text-white flex items-center gap-3">

              <span className="text-4xl">
                {icon}
              </span>

              {title}

            </h2>

            {subtitle && (
              <p className="text-slate-300 mt-2">
                {subtitle}
              </p>
            )}

          </div>

          {/* Decorative Badge */}

          <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-white/10 border border-white/20">

            <span className="text-2xl">
              ✨
            </span>

          </div>

        </div>
      )}

      {/* Divider */}

      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

      {/* Body */}

      <div>
        {children}
      </div>

    </section>
  );
}