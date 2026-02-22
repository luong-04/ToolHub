export default function ToolHubLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const dims = { sm: { icon: 28, text: 'text-base' }, md: { icon: 34, text: 'text-xl' }, lg: { icon: 44, text: 'text-3xl' } }[size];

    return (
        <div className="flex items-center gap-2.5 group">
            {/* Hexagon circuit icon */}
            <div className="relative" style={{ width: dims.icon, height: dims.icon }}>
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]">
                    {/* Outer hexagon */}
                    <path
                        d="M24 3L43.5 14.25V36.75L24 48L4.5 36.75V14.25L24 3Z"
                        stroke="url(#logo-grad)" strokeWidth="2.5" fill="rgba(0,243,255,0.06)"
                    />
                    {/* Inner circuit lines */}
                    <path d="M24 14V24M24 24L32 30M24 24L16 30" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" />
                    {/* Circuit dots */}
                    <circle cx="24" cy="12" r="2.5" fill="#00f3ff" />
                    <circle cx="33" cy="31" r="2.5" fill="#00f3ff" />
                    <circle cx="15" cy="31" r="2.5" fill="#00f3ff" />
                    {/* Center dot */}
                    <circle cx="24" cy="24" r="3" fill="#00f3ff" className="animate-pulse" />
                    <defs>
                        <linearGradient id="logo-grad" x1="4" y1="3" x2="44" y2="48">
                            <stop offset="0%" stopColor="#00f3ff" />
                            <stop offset="100%" stopColor="#0070ff" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            {/* Text */}
            <span className={`${dims.text} font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent`}>
                TOOL<span className="text-white">HUB</span>
            </span>
        </div>
    );
}
