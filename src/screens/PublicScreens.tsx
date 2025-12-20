import React from "react"

// --- Screen 1: Landing (Dragon Banner) ---
export const LandingScreen: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center pb-20">
      <section className="w-full max-w-[1400px] px-4 py-8 md:px-10">
        <div className="bg-surface-dark relative flex min-h-[480px] w-full flex-col justify-end overflow-hidden rounded-3xl p-6 shadow-2xl lg:p-12">
          <div
            className="absolute inset-0 h-full w-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage:
                'linear-gradient(180deg, rgba(24,20,17,0) 0%, rgba(24,20,17,0.8) 60%, rgba(24,20,17,1) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCblfj9j0D5n4sdowefElB3DYUr0WJsmhzZFJGlqZsSPgD_B1janepkYX9R71QfQ9atKXbsyrlzk-7_4tQ71rfJ29V5UrZmLjkb1yTKfvq4jf5hNEbHErCVBSVJvX5VemR5yArsOaTUTQJMfG_yCNCyGrBdVgYDC_wXOyX9jnkYzabVA86Wqq6L7wz3kgP3wlzAvcOmMDuvWsPfsgtIWkL6ZBY1wa0zf0i2pXd8fcH5aFVs5wEAgrV4PO_LdWqz6tro-r9T8DBl8QF2")',
            }}
          ></div>
          <div className="relative z-10 flex max-w-2xl flex-col items-start gap-4">
            <div className="bg-primary/20 border-primary/30 flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur-sm">
              <span className="material-symbols-outlined text-primary text-sm">
                local_fire_department
              </span>
              <span className="text-primary text-xs font-bold tracking-wider uppercase">
                Season 5: Dragon's Awakening
              </span>
            </div>
            <h1 className="font-display text-4xl leading-tight font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Unleash the Draconic Fire.
            </h1>
            <p className="text-lg font-light text-gray-200 sm:text-xl">
              The S-Rank dragons have awakened. Pull from the new limited-time
              banner and collect the rarest holographic legends before they
              vanish.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <button className="bg-primary text-background-dark hover:bg-primary-dark shadow-primary/20 flex h-14 items-center justify-center gap-2 rounded-xl px-8 text-lg font-bold shadow-lg transition-transform hover:scale-105">
                <span className="material-symbols-outlined">stars</span>
                Pull 10x • 500 Credits
              </button>
              <button className="flex h-14 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-6 text-lg font-bold text-white backdrop-blur-md transition-colors hover:bg-white/20">
                <span className="material-symbols-outlined">info</span>
                View Drop Rates
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packs Grid */}
      <section className="w-full max-w-[1400px] px-4 pb-12 md:px-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <span className="material-symbols-outlined text-primary">
              auto_awesome
            </span>{" "}
            Featured Packs
          </h2>
          <button className="text-primary text-sm font-bold transition-colors hover:text-white">
            View All Packs
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Cybernetic Horizon",
              color: "from-blue-600 to-cyan-400",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4AxbRwdkXYKvWrHK8F9rrqDPiFe-1C1OJDu50OJ24W0jliDtW7f4F6IC5OvRIJFaTxbNEdbzp7xfCzCzXw4AQQIDg5Tio1sNIZWrb7_7IFraiePvkS0iYKv-bALPNG93IS-VeAbQxhCrm59w-p8Z-P9lb2gWdp4YX2zdwi3XeYWwA8QUIy_linEDf54jmuGcH6ubUatfH8Vkbm3RUh6lfmb1LUXDT2zTg45OHhy0Sv6mu7fAHU5xL7q1-SU7ALxISrSGJh3vxda6k",
              price: "500",
            },
            {
              title: "Ancient Forest",
              color: "from-green-600 to-emerald-400",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlF3KWYUwTxjc8Grm19nxhxQ_j6qx_O_vpDsZklONjoNG3lOznCMzJR7B7MgYJjy7QUIdCJH-k_UM7iPIdAAsy-_NobkVO7g_vY6BI9NsQaKpnyWCbXXnLuRrs2YePxbrVYPZUO8vMDUUULrr77gKK5r4Y3HAI3za0C0xQMsQt1WgxSy6Q8mtAaaG6qtKG4fvglDUINxtoJHB6fgHkZZuPX0oNqo6xyfVSku9Km9etGnsABLG9bo4FQ5sQxVFdJJQB8EsDe1l7HFB4",
              price: "450",
            },
            {
              title: "Void Walkers",
              color: "from-purple-600 to-pink-400",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBr3_qKwl0IfvhNnGMyqxlWkLAKVqmX6Zu1Eerg669x3CBtHUJoT9SMT2ggu_O-38uybdBCPg0dXlcv6SUqnWIuLmbszYtEzr2AJvpBezoEHsY2SULzrAu6RojrSNiSHTYxhJ9Y_csu8ezmkjzyia6f5pKpkyiRTcCinYdCHWqjNsJS5VOnMiH_eovlzSkO4FDZYQDF7lS5qEPr1b59u8yxL8px-OPaX9WnhaNCPUvzyAH6S9PeouJCfrIJW6GFtBb2gbGKHSl2Gm1",
              price: "600",
            },
          ].map((pack, i) => (
            <div
              key={i}
              className="bg-surface-dark border-border-dark hover:border-primary/50 group relative h-64 cursor-pointer overflow-hidden rounded-2xl border transition-all"
            >
              <div className="${pack.color} absolute inset-0 z-0 bg-gradient-to-br opacity-10 transition-opacity group-hover:opacity-20"></div>
              <div className="absolute -right-12 -bottom-12 z-0 h-48 w-48 rounded-full bg-gradient-to-br from-white/5 to-white/0 blur-2xl"></div>

              <div className="relative z-10 flex h-full items-center justify-between p-6">
                <div className="flex h-full flex-col justify-center gap-4">
                  <div>
                    <span className="text-primary bg-primary/10 mb-2 inline-block rounded px-2 py-1 text-xs font-bold">
                      SERIES {i + 1}
                    </span>
                    <h3 className="max-w-[120px] text-2xl leading-tight font-bold text-white">
                      {pack.title}
                    </h3>
                  </div>
                  <button className="flex w-fit items-center gap-2 rounded-lg border border-white/5 bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20">
                    <span className="material-symbols-outlined text-primary text-sm">
                      diamond
                    </span>{" "}
                    {pack.price}
                  </button>
                </div>
                <div className="relative h-full w-1/2">
                  <img
                    src={pack.img}
                    className="absolute top-1/2 left-1/2 h-[120%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Cards Section */}
      <section className="w-full max-w-[1400px] px-4 pb-12 md:px-10">
        <h2 className="mb-6 text-2xl font-bold text-white">Trending Now</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="bg-surface-dark border-border-dark hover:border-primary/50 group cursor-pointer overflow-hidden rounded-xl border transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#2d241b]">
                <div className="absolute top-2 left-2 z-10 rounded border border-white/10 bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                  #{1000 + item}
                </div>
                <img
                  src={`https://lh3.googleusercontent.com/aida-public/AB6AXuCN1vOA2xdIpPnb0RTNNv7tjcq_GR1o7XQV0iWHCNyn-2nEoKmniFTvjwx8VgGx_1t9uC9ZsoZuAtzkLUgZrIYHAXyj4khCiim1_qDzZNgrWsNKDiGIWEsqRpnqiWjoZHratm6HNXJz9B65BXmG3IJVsSWHUR4nHjSR3xE24xr2LONAbEzSDXK6e30aqFzplyAk_hsf0xjJmA37m2xSLrSWClNzh4V2gciqW3A2-V2Y-lwVAUXcSaCwmTK-46yXsUSMz_1uZRkuWAsN`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-3">
                <h4 className="truncate text-sm font-bold text-white">
                  Mecha Paladin
                </h4>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-text-secondary text-xs">Bid</span>
                  <span className="text-primary text-sm font-bold">250 G</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// --- Screen 2: Marketplace Listing ---
export const MarketplaceScreen: React.FC = () => {
  const cards = [
    {
      name: "Mecha Samurai",
      rarity: "UR",
      price: "2,400",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN1vOA2xdIpPnb0RTNNv7tjcq_GR1o7XQV0iWHCNyn-2nEoKmniFTvjwx8VgGx_1t9uC9ZsoZuAtzkLUgZrIYHAXyj4khCiim1_qDzZNgrWsNKDiGIWEsqRpnqiWjoZHratm6HNXJz9B65BXmG3IJVsSWHUR4nHjSR3xE24xr2LONAbEzSDXK6e30aqFzplyAk_hsf0xjJmA37m2xSLrSWClNzh4V2gciqW3A2-V2Y-lwVAUXcSaCwmTK-46yXsUSMz_1uZRkuWAsN",
      tag: "bg-purple-900/80 text-purple-200 border-purple-500/30",
    },
    {
      name: "Azure Dragon",
      rarity: "SSR",
      price: "1,850",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfnGf9Sc_OQOAi79UOhJsx8j1CzV_Zl2AvdZf8RBZNBVb9uX5gtdRP7Mn_ZK5QszE5_Z6Vd4D_LHFBM1gGV5wm7IZup6gpXo7W24qTk5liQlWQxpGKMzxHJHkKp8peLA76Vo2CvV_EIM6stQaf9DkNMuf5pahfv4fQprFcVpP6a_9NKkNQPJ10NdqpQxF7CPz_YIm8VTLOKYLaMdOggLoUn8R7DuRwy1Sq5gQYRMPQJSLP84tJGLXx7ThaqI8yaIm21WWn1W6_eW_X",
      tag: "bg-yellow-600/80 text-yellow-100 border-yellow-400/30",
    },
    {
      name: "Void Walker",
      rarity: "SR",
      price: "950",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBr3_qKwl0IfvhNnGMyqxlWkLAKVqmX6Zu1Eerg669x3CBtHUJoT9SMT2ggu_O-38uybdBCPg0dXlcv6SUqnWIuLmbszYtEzr2AJvpBezoEHsY2SULzrAu6RojrSNiSHTYxhJ9Y_csu8ezmkjzyia6f5pKpkyiRTcCinYdCHWqjNsJS5VOnMiH_eovlzSkO4FDZYQDF7lS5qEPr1b59u8yxL8px-OPaX9WnhaNCPUvzyAH6S9PeouJCfrIJW6GFtBb2gbGKHSl2Gm1",
      tag: "bg-red-900/80 text-red-200 border-red-500/30",
    },
    {
      name: "Forest Guardian",
      rarity: "R",
      price: "400",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlF3KWYUwTxjc8Grm19nxhxQ_j6qx_O_vpDsZklONjoNG3lOznCMzJR7B7MgYJjy7QUIdCJH-k_UM7iPIdAAsy-_NobkVO7g_vY6BI9NsQaKpnyWCbXXnLuRrs2YePxbrVYPZUO8vMDUUULrr77gKK5r4Y3HAI3za0C0xQMsQt1WgxSy6Q8mtAaaG6qtKG4fvglDUINxtoJHB6fgHkZZuPX0oNqo6xyfVSku9Km9etGnsABLG9bo4FQ5sQxVFdJJQB8EsDe1l7HFB4",
      tag: "bg-green-900/80 text-green-200 border-green-500/30",
    },
    {
      name: "Solar Flare",
      rarity: "R",
      price: "320",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4AxbRwdkXYKvWrHK8F9rrqDPiFe-1C1OJDu50OJ24W0jliDtW7f4F6IC5OvRIJFaTxbNEdbzp7xfCzCzXw4AQQIDg5Tio1sNIZWrb7_7IFraiePvkS0iYKv-bALPNG93IS-VeAbQxhCrm59w-p8Z-P9lb2gWdp4YX2zdwi3XeYWwA8QUIy_linEDf54jmuGcH6ubUatfH8Vkbm3RUh6lfmb1LUXDT2zTg45OHhy0Sv6mu7fAHU5xL7q1-SU7ALxISrSGJh3vxda6k",
      tag: "bg-blue-900/80 text-blue-200 border-blue-500/30",
    },
    {
      name: "Iron Golem",
      rarity: "C",
      price: "50",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN1vOA2xdIpPnb0RTNNv7tjcq_GR1o7XQV0iWHCNyn-2nEoKmniFTvjwx8VgGx_1t9uC9ZsoZuAtzkLUgZrIYHAXyj4khCiim1_qDzZNgrWsNKDiGIWEsqRpnqiWjoZHratm6HNXJz9B65BXmG3IJVsSWHUR4nHjSR3xE24xr2LONAbEzSDXK6e30aqFzplyAk_hsf0xjJmA37m2xSLrSWClNzh4V2gciqW3A2-V2Y-lwVAUXcSaCwmTK-46yXsUSMz_1uZRkuWAsN",
      tag: "bg-gray-700/80 text-gray-200 border-gray-500/30",
    },
    {
      name: "Mystic Elf",
      rarity: "SR",
      price: "800",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfnGf9Sc_OQOAi79UOhJsx8j1CzV_Zl2AvdZf8RBZNBVb9uX5gtdRP7Mn_ZK5QszE5_Z6Vd4D_LHFBM1gGV5wm7IZup6gpXo7W24qTk5liQlWQxpGKMzxHJHkKp8peLA76Vo2CvV_EIM6stQaf9DkNMuf5pahfv4fQprFcVpP6a_9NKkNQPJ10NdqpQxF7CPz_YIm8VTLOKYLaMdOggLoUn8R7DuRwy1Sq5gQYRMPQJSLP84tJGLXx7ThaqI8yaIm21WWn1W6_eW_X",
      tag: "bg-pink-900/80 text-pink-200 border-pink-500/30",
    },
    {
      name: "Dark Magus",
      rarity: "SSR",
      price: "2,100",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBr3_qKwl0IfvhNnGMyqxlWkLAKVqmX6Zu1Eerg669x3CBtHUJoT9SMT2ggu_O-38uybdBCPg0dXlcv6SUqnWIuLmbszYtEzr2AJvpBezoEHsY2SULzrAu6RojrSNiSHTYxhJ9Y_csu8ezmkjzyia6f5pKpkyiRTcCinYdCHWqjNsJS5VOnMiH_eovlzSkO4FDZYQDF7lS5qEPr1b59u8yxL8px-OPaX9WnhaNCPUvzyAH6S9PeouJCfrIJW6GFtBb2gbGKHSl2Gm1",
      tag: "bg-yellow-600/80 text-yellow-100 border-yellow-400/30",
    },
  ]

  return (
    <div className="flex w-full flex-col items-center px-4 py-8 lg:px-10">
      <div className="flex w-full max-w-[1400px] flex-col gap-8">
        <div className="bg-surface-dark relative mb-8 flex min-h-[300px] items-center overflow-hidden rounded-2xl">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
          <div
            className="absolute top-0 right-0 h-full w-3/4 bg-cover bg-center opacity-80"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD56GECvrND1qO0VJ6sTBopfw_-ERkKWrs_EWdjQffPV9-TJGhrFJxurNdP8ygteM0U2pYfXTgsiiXnqUJPTN8cKWYuaux1xydiQKk_9bUtrV_lqMYHIWkYlxb6drzmsiTQAitkat1Ngoo4gzDXHaNHY0R7QEcKiwzQXppBuUAe2WmvMhotAZudm7AMoqJ59NBh6rrbulhSy2r6GJj8L6e7I805btVQDc6w56Iwi1KovYVbi5P6T-56prw4bDkPCgNfVjXjIdo_Q0mk")',
            }}
          ></div>
          <div className="relative z-20 p-8 md:w-1/2 md:p-12">
            <span className="bg-primary/20 text-primary mb-2 inline-block rounded px-2 py-1 text-xs font-bold tracking-wider uppercase">
              New Drop
            </span>
            <h1 className="mb-4 text-3xl leading-tight font-bold text-white drop-shadow-lg sm:text-4xl">
              Unlock the Future of Cards
            </h1>
            <button className="bg-primary flex w-fit items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-105">
              <span className="material-symbols-outlined">bolt</span> Pull Now -
              500 Coins
            </button>
          </div>
        </div>

        <div className="no-scrollbar mb-4 flex items-center gap-4 overflow-x-auto pb-2">
          <button className="bg-primary text-background-dark rounded-lg px-4 py-2 text-sm font-bold whitespace-nowrap">
            All Cards
          </button>
          <button className="bg-surface-dark border-border-dark text-text-secondary rounded-lg border px-4 py-2 text-sm whitespace-nowrap hover:text-white">
            Legendary
          </button>
          <button className="bg-surface-dark border-border-dark text-text-secondary rounded-lg border px-4 py-2 text-sm whitespace-nowrap hover:text-white">
            Epic
          </button>
          <button className="bg-surface-dark border-border-dark text-text-secondary rounded-lg border px-4 py-2 text-sm whitespace-nowrap hover:text-white">
            Rare
          </button>
          <button className="bg-surface-dark border-border-dark text-text-secondary rounded-lg border px-4 py-2 text-sm whitespace-nowrap hover:text-white">
            Common
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-surface-dark border-border-dark hover:border-primary/50 group relative flex flex-col overflow-hidden rounded-2xl border transition-all hover:-translate-y-1"
            >
              <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-[#2d241b] p-4">
                <div
                  className={`absolute top-3 left-3 z-10 rounded-md border px-2 py-1 text-xs font-bold backdrop-blur-md ${card.tag}`}
                >
                  {card.rarity}
                </div>
                <img
                  src={card.img}
                  className="h-full object-contain shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                />
              </div>
              <div className="flex flex-col p-4">
                <h3 className="group-hover:text-primary text-lg font-bold text-white transition-colors">
                  {card.name}
                </h3>
                <div className="border-border-dark mt-4 flex items-center justify-between border-t pt-4">
                  <div className="flex flex-col">
                    <span className="text-text-secondary text-xs">Price</span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-[16px]">
                        monetization_on
                      </span>
                      <span className="text-lg font-bold text-white">
                        {card.price}
                      </span>
                    </div>
                  </div>
                  <button className="bg-surface-highlight border-border-dark flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black">
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Screen 3: Detail Screen (Azure Dragon) ---
export const ProductDetailScreen: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center px-4 py-8 md:px-10">
      <div className="grid w-full max-w-[1200px] grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left: Image */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <div className="bg-surface-dark border-border-dark from-primary/10 relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] to-transparent">
            <div className="bg-primary/20 absolute inset-0 opacity-20 blur-[100px]"></div>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfnGf9Sc_OQOAi79UOhJsx8j1CzV_Zl2AvdZf8RBZNBVb9uX5gtdRP7Mn_ZK5QszE5_Z6Vd4D_LHFBM1gGV5wm7IZup6gpXo7W24qTk5liQlWQxpGKMzxHJHkKp8peLA76Vo2CvV_EIM6stQaf9DkNMuf5pahfv4fQprFcVpP6a_9NKkNQPJ10NdqpQxF7CPz_YIm8VTLOKYLaMdOggLoUn8R7DuRwy1Sq5gQYRMPQJSLP84tJGLXx7ThaqI8yaIm21WWn1W6_eW_X"
              className="z-10 h-[85%] object-contain shadow-2xl shadow-black/50"
            />
          </div>
        </div>
        {/* Right: Info */}
        <div className="flex flex-col lg:col-span-5">
          <div className="border-border-dark mb-6 border-b pb-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="bg-primary/20 text-primary border-primary/20 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase">
                Legendary
              </span>
            </div>
            <h1 className="mb-2 text-4xl font-bold text-white">Azure Dragon</h1>
            <p className="text-text-secondary text-lg">
              Fantasy Set • 1st Edition • 2024
            </p>
          </div>
          <div className="mb-8 flex flex-col gap-4">
            <div className="border-primary/30 relative flex items-center justify-between overflow-hidden rounded-xl border bg-gradient-to-br from-[#3d2c1e] to-[#2a221b] p-5">
              <span className="material-symbols-outlined text-primary absolute top-[-20px] right-[-20px] rotate-12 text-9xl opacity-10">
                casino
              </span>
              <div className="relative z-10">
                <p className="text-primary mb-1 text-sm font-bold uppercase">
                  Try your luck
                </p>
                <span className="text-3xl font-bold text-white">
                  $5.00{" "}
                  <span className="text-text-secondary text-sm font-normal">
                    / pull
                  </span>
                </span>
              </div>
              <button className="bg-primary hover:bg-primary-hover relative z-10 flex items-center gap-2 rounded-lg px-6 py-3 font-bold text-white shadow-lg">
                <span className="material-symbols-outlined">bolt</span> Pull Now
              </button>
            </div>
            <div className="bg-surface-dark border-border-dark flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="text-text-secondary mb-1 text-xs font-bold uppercase">
                  Direct Purchase
                </p>
                <span className="text-xl font-bold text-white">$124.50</span>
              </div>
              <button className="border-border-dark rounded-lg border bg-transparent px-5 py-2 font-medium text-white hover:border-white">
                Add to Cart
              </button>
            </div>
          </div>
          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-2 gap-3">
            <div className="bg-surface-dark border-border-dark rounded-lg border p-3">
              <div className="text-text-secondary mb-1 flex items-center gap-1 text-xs font-bold uppercase">
                <span className="material-symbols-outlined text-sm">
                  swords
                </span>{" "}
                Attack
              </div>
              <div className="font-mono text-lg text-white">2,500</div>
            </div>
            <div className="bg-surface-dark border-border-dark rounded-lg border p-3">
              <div className="text-text-secondary mb-1 flex items-center gap-1 text-xs font-bold uppercase">
                <span className="material-symbols-outlined text-sm">
                  shield
                </span>{" "}
                Defense
              </div>
              <div className="font-mono text-lg text-white">1,850</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Screen 4: Gacha Pull Animation ---
export const GachaPullScreen: React.FC = () => {
  return (
    <div className="flex flex-1 justify-center px-4 py-8 sm:px-10">
      <div className="flex max-w-[1024px] flex-1 flex-col gap-12">
        <section className="bg-surface-dark border-border-dark relative flex min-h-[600px] items-center justify-center overflow-hidden rounded-3xl border shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a221b] to-[#181411]"></div>
          <div className="bg-primary/5 pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"></div>

          <div className="relative z-10 flex w-full flex-col items-center gap-12 p-8 md:flex-row">
            <div className="flex flex-1 justify-center">
              <div className="perspective-1000 group relative aspect-[4/5] w-full max-w-[320px] animate-pulse cursor-pointer">
                <div className="bg-primary/20 absolute inset-0 rounded-full blur-[50px]"></div>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4AxbRwdkXYKvWrHK8F9rrqDPiFe-1C1OJDu50OJ24W0jliDtW7f4F6IC5OvRIJFaTxbNEdbzp7xfCzCzXw4AQQIDg5Tio1sNIZWrb7_7IFraiePvkS0iYKv-bALPNG93IS-VeAbQxhCrm59w-p8Z-P9lb2gWdp4YX2zdwi3XeYWwA8QUIy_linEDf54jmuGcH6ubUatfH8Vkbm3RUh6lfmb1LUXDT2zTg45OHhy0Sv6mu7fAHU5xL7q1-SU7ALxISrSGJh3vxda6k"
                  className="relative z-10 h-full w-full transform object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4 flex items-center justify-center gap-2 md:justify-start">
                <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase">
                  Season 1
                </span>
              </div>
              <h1 className="mb-4 text-5xl leading-none font-black text-white md:text-6xl">
                Cosmic <br />
                <span className="from-primary bg-gradient-to-r to-yellow-400 bg-clip-text text-transparent">
                  Legends
                </span>
              </h1>
              <p className="text-text-secondary mx-auto mb-8 max-w-md text-lg md:mx-0">
                Unleash the power of the stars. Each pack contains 10 cards with
                a guaranteed Rare or higher.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                <button className="bg-primary hover:bg-primary-hover text-background-dark shadow-primary/20 flex min-w-[160px] flex-col items-center rounded-xl px-8 py-4 text-lg font-bold shadow-lg">
                  <span>PULL 1X</span>
                  <span className="mt-1 flex items-center gap-1 text-xs font-normal opacity-80">
                    <span className="material-symbols-outlined text-xs">
                      diamond
                    </span>{" "}
                    500
                  </span>
                </button>
                <button className="bg-surface-highlight border-primary/50 text-primary hover:bg-primary/10 flex min-w-[160px] flex-col items-center rounded-xl border-2 px-8 py-4 text-lg font-bold transition-colors">
                  <span>PULL 10X</span>
                  <span className="mt-1 flex items-center gap-1 text-xs font-normal opacity-80">
                    <span className="material-symbols-outlined text-xs">
                      diamond
                    </span>{" "}
                    5000
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

// --- Screen 5: My Collection ---
export const CollectionScreen: React.FC = () => {
  const collection = [
    {
      name: "Phoenix Ascendant",
      lvl: "1",
      id: "#0042",
      rarity: "Legendary",
      color: "from-yellow-500 to-primary",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlF3KWYUwTxjc8Grm19nxhxQ_j6qx_O_vpDsZklONjoNG3lOznCMzJR7B7MgYJjy7QUIdCJH-k_UM7iPIdAAsy-_NobkVO7g_vY6BI9NsQaKpnyWCbXXnLuRrs2YePxbrVYPZUO8vMDUUULrr77gKK5r4Y3HAI3za0C0xQMsQt1WgxSy6Q8mtAaaG6qtKG4fvglDUINxtoJHB6fgHkZZuPX0oNqo6xyfVSku9Km9etGnsABLG9bo4FQ5sQxVFdJJQB8EsDe1l7HFB4",
    },
    {
      name: "Void Walker",
      lvl: "5",
      id: "#0156",
      rarity: "Epic",
      color: "bg-purple-600",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBr3_qKwl0IfvhNnGMyqxlWkLAKVqmX6Zu1Eerg669x3CBtHUJoT9SMT2ggu_O-38uybdBCPg0dXlcv6SUqnWIuLmbszYtEzr2AJvpBezoEHsY2SULzrAu6RojrSNiSHTYxhJ9Y_csu8ezmkjzyia6f5pKpkyiRTcCinYdCHWqjNsJS5VOnMiH_eovlzSkO4FDZYQDF7lS5qEPr1b59u8yxL8px-OPaX9WnhaNCPUvzyAH6S9PeouJCfrIJW6GFtBb2gbGKHSl2Gm1",
    },
    {
      name: "Mecha Samurai",
      lvl: "3",
      id: "#0221",
      rarity: "Rare",
      color: "bg-blue-600",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN1vOA2xdIpPnb0RTNNv7tjcq_GR1o7XQV0iWHCNyn-2nEoKmniFTvjwx8VgGx_1t9uC9ZsoZuAtzkLUgZrIYHAXyj4khCiim1_qDzZNgrWsNKDiGIWEsqRpnqiWjoZHratm6HNXJz9B65BXmG3IJVsSWHUR4nHjSR3xE24xr2LONAbEzSDXK6e30aqFzplyAk_hsf0xjJmA37m2xSLrSWClNzh4V2gciqW3A2-V2Y-lwVAUXcSaCwmTK-46yXsUSMz_1uZRkuWAsN",
    },
    {
      name: "Forest Guardian",
      lvl: "12",
      id: "#0410",
      rarity: "Rare",
      color: "bg-green-600",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlF3KWYUwTxjc8Grm19nxhxQ_j6qx_O_vpDsZklONjoNG3lOznCMzJR7B7MgYJjy7QUIdCJH-k_UM7iPIdAAsy-_NobkVO7g_vY6BI9NsQaKpnyWCbXXnLuRrs2YePxbrVYPZUO8vMDUUULrr77gKK5r4Y3HAI3za0C0xQMsQt1WgxSy6Q8mtAaaG6qtKG4fvglDUINxtoJHB6fgHkZZuPX0oNqo6xyfVSku9Km9etGnsABLG9bo4FQ5sQxVFdJJQB8EsDe1l7HFB4",
    },
    {
      name: "Solar Flare",
      lvl: "2",
      id: "#0551",
      rarity: "Common",
      color: "bg-gray-600",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4AxbRwdkXYKvWrHK8F9rrqDPiFe-1C1OJDu50OJ24W0jliDtW7f4F6IC5OvRIJFaTxbNEdbzp7xfCzCzXw4AQQIDg5Tio1sNIZWrb7_7IFraiePvkS0iYKv-bALPNG93IS-VeAbQxhCrm59w-p8Z-P9lb2gWdp4YX2zdwi3XeYWwA8QUIy_linEDf54jmuGcH6ubUatfH8Vkbm3RUh6lfmb1LUXDT2zTg45OHhy0Sv6mu7fAHU5xL7q1-SU7ALxISrSGJh3vxda6k",
    },
  ]

  return (
    <div className="flex w-full flex-col items-center px-4 py-8 lg:px-20">
      <div className="flex w-full max-w-[1400px] flex-col gap-8">
        <div className="border-border-dark flex flex-col items-end justify-between gap-4 border-b pb-6 md:flex-row">
          <div>
            <h1 className="mb-2 text-4xl font-black text-white">
              My Collection
            </h1>
            <p className="text-text-secondary">
              Manage your trading card empire.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-surface-dark border-border-dark min-w-[160px] rounded-xl border p-4">
              <p className="text-text-secondary text-xs font-bold uppercase">
                Total Value
              </p>
              <p className="text-2xl font-bold text-white">$4,500</p>
            </div>
            <div className="bg-surface-dark border-border-dark min-w-[160px] rounded-xl border p-4">
              <p className="text-text-secondary text-xs font-bold uppercase">
                Completion
              </p>
              <p className="text-primary text-2xl font-bold">68%</p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {collection.map((item, i) => (
            <div
              key={i}
              className="bg-surface-dark border-border-dark hover:border-primary group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
                <div className="absolute top-2 left-2 z-10 flex gap-1">
                  <span
                    className={`${item.color.includes("gradient") ? "bg-gradient-to-r" : ""} ${item.color} rounded px-2 py-0.5 text-[10px] font-bold text-white`}
                  >
                    {item.rarity}
                  </span>
                </div>
                <img
                  src={item.img}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-3">
                <h3 className="truncate text-sm font-bold text-white">
                  {item.name}
                </h3>
                <p className="text-text-secondary mt-1 text-xs">
                  Lvl {item.lvl} • {item.id}
                </p>
              </div>
            </div>
          ))}
          {/* Fill empty spots visually if needed */}
          {[1, 2, 3].map((n) => (
            <div
              key={`empty-${n}`}
              className="border-border-dark flex aspect-[3/4] items-center justify-center rounded-xl border border-dashed opacity-30"
            >
              <span className="text-text-secondary text-sm">Empty Slot</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Screen 6: Checkout ---
export const CheckoutScreen: React.FC = () => {
  return (
    <div className="flex justify-center px-4 py-8">
      <div className="flex w-full max-w-[1200px] flex-col gap-12 lg:flex-row">
        <div className="flex-1">
          <h1 className="mb-8 text-3xl font-bold text-white">Checkout</h1>
          <div className="flex flex-col gap-6">
            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <span className="material-symbols-outlined text-primary">
                  contact_mail
                </span>{" "}
                Contact Info
              </h3>
              <input
                className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1"
                placeholder="Email Address"
                value="kai.takahashi@example.com"
              />
            </div>
            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <span className="material-symbols-outlined text-primary">
                  credit_card
                </span>{" "}
                Payment
              </h3>
              <div className="mb-4 flex gap-2">
                <button className="bg-primary text-background-dark flex-1 rounded-lg py-2 font-bold">
                  Card
                </button>
                <button className="bg-background-dark text-text-secondary border-border-dark flex-1 rounded-lg border py-2">
                  PayPal
                </button>
              </div>
              <div className="space-y-4">
                <input
                  className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1"
                  placeholder="Card Number"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1"
                    placeholder="MM/YY"
                  />
                  <input
                    className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1"
                    placeholder="CVC"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[400px]">
          <div className="bg-surface-dark border-border-dark sticky top-24 rounded-xl border p-6">
            <h3 className="mb-4 text-lg font-bold text-white">Your Cart</h3>
            <div className="mb-6 flex flex-col gap-4">
              <div className="flex gap-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfnRI62BxSLxnz5OJVem-u6k0nOGi_v0gqs4l00uy0vJbzVhveztYrcCdtosK6FkLavX5NMXqz3uZzxHRrFzf5TElDRo7ZDn4rHufJvDHD3c798ZBa9nLfQp_GwiTSgRXlBHvbs3sAfowWc9BqtFUflVdpup_ajoDlxAgK-bO72NJtyXm-VjjMx7uMtiLpjJ7OC_zQOH01P9E22Cu-qYkI4tdxuVpK2x0yPU556w77mEX_KvCM-r8A8IgCfXyE9JpXn1MSCHbLqH4T"
                  className="border-border-dark h-20 w-16 rounded-lg border object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">
                    Legendary Dragon Pack
                  </p>
                  <p className="text-primary mt-1 font-bold">$14.99</p>
                </div>
              </div>
            </div>
            <div className="border-border-dark flex flex-col gap-2 border-t pt-4">
              <div className="text-text-secondary flex justify-between text-sm">
                <span>Subtotal</span>
                <span>$39.94</span>
              </div>
              <div className="mt-2 flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>$48.14</span>
              </div>
            </div>
            <button className="bg-primary hover:bg-primary-hover text-background-dark mt-6 w-full rounded-xl py-3 font-bold">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Screen 7: User Profile ---
export const UserProfileScreen: React.FC = () => {
  return (
    <div className="flex-1 p-8">
      {/* Reusing the layout from sidebar but expanded */}
      <div className="mx-auto max-w-4xl">
        <div className="bg-surface-dark border-border-dark mb-8 flex flex-col items-center gap-8 rounded-2xl border p-8 md:flex-row">
          <div className="relative">
            <div
              className="border-primary h-32 w-32 rounded-full border-4 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB9JRJLfT8oZa5JAJj2RtM6Xr6jeQgV7RVPodUQoE0qN8VYw2oOPpSWbjOBPi2qsZLdsFWUiL4P0dlX9ofljHmTtsvyaQRvK0hETMomBNzmgjayb_5d81Md9HNR9Z411FaiJOhT5HGw3C_kcIdiMbn4HMvQyFPZw0h7_E8GzQAIjupV8fR1pxSeGMEBltqDTVLLtn3-BjSRPBQ2YvxFnEzYUnh-Hua9vZK_PhtZksTdlpsnVdlQ-j-OW8AJlOef4t8_EEc-gU9fR3uz")',
              }}
            ></div>
            <button className="bg-primary absolute right-0 bottom-0 rounded-full p-2 text-white">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white">DuelistKai</h1>
            <p className="text-text-secondary mt-1">
              Level 42 Collector • Joined 2023
            </p>
            <div className="mt-4 flex justify-center gap-4 md:justify-start">
              <div className="bg-background-dark text-text-secondary border-border-dark rounded-lg border px-4 py-2 text-sm">
                Verified
              </div>
              <div className="bg-background-dark text-text-secondary border-border-dark rounded-lg border px-4 py-2 text-sm">
                VIP Member
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-surface-dark border-border-dark rounded-2xl border p-6">
            <h3 className="mb-4 font-bold text-white">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-text-secondary text-sm">
                  Display Name
                </label>
                <input
                  className="bg-background-dark border-border-dark mt-1 w-full rounded-lg border px-3 py-2 text-white"
                  value="DuelistKai"
                />
              </div>
              <div>
                <label className="text-text-secondary text-sm">Email</label>
                <input
                  className="bg-background-dark border-border-dark mt-1 w-full rounded-lg border px-3 py-2 text-white"
                  value="kai.duelist@example.com"
                />
              </div>
            </div>
          </div>
          <div className="bg-surface-dark border-border-dark rounded-2xl border p-6">
            <h3 className="mb-4 font-bold text-white">Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Total Value</span>
                <span className="font-bold text-white">$12,450</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Rare Cards</span>
                <span className="font-bold text-white">142</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Trades Completed</span>
                <span className="font-bold text-white">58</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Screen 8: User Milestones ---
export const UserMilestonesScreen: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-8">
      <div className="w-full max-w-[1024px]">
        <h1 className="mb-2 text-3xl font-black text-white">
          Collector Status
        </h1>
        <div className="bg-surface-dark border-border-dark relative mb-8 flex flex-col items-center gap-8 overflow-hidden rounded-xl border p-8 md:flex-row">
          <div className="bg-primary pointer-events-none absolute top-0 right-0 h-full w-1/2 rounded-l-full opacity-10"></div>
          <div className="border-primary/20 bg-background-dark relative z-10 flex h-32 w-32 items-center justify-center rounded-full border-4">
            <span className="material-symbols-outlined text-primary text-6xl">
              military_tech
            </span>
          </div>
          <div className="z-10 flex-1">
            <h2 className="text-2xl font-bold text-white">Expert Collector</h2>
            <p className="text-text-secondary mb-4">
              Top 5% of collectors this season.
            </p>
            <div className="bg-background-dark h-3 w-full overflow-hidden rounded-full">
              <div className="bg-primary h-full w-[77%]"></div>
            </div>
            <div className="text-text-secondary mt-1 flex justify-between text-xs">
              <span>Level 12</span>
              <span>1,550 / 2,000 XP</span>
            </div>
          </div>
        </div>
        <h2 className="mb-4 text-xl font-bold text-white">Rewards Ready</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="dark:bg-surface-dark border-border-dark flex flex-col gap-4 rounded-xl border bg-white p-4">
            <div className="bg-background-dark relative flex h-32 items-center justify-center overflow-hidden rounded-lg">
              <span className="material-symbols-outlined z-10 text-4xl text-white">
                percent
              </span>
              <div className="bg-primary/20 absolute inset-0"></div>
            </div>
            <div>
              <span className="text-primary bg-primary/20 rounded px-2 py-0.5 text-xs font-bold">
                LEVEL 12
              </span>
              <h3 className="mt-1 text-lg font-bold text-white">
                10% Off Next Pack
              </h3>
            </div>
            <button className="bg-primary text-background-dark mt-auto w-full rounded-lg py-2 font-bold">
              Claim Reward
            </button>
          </div>

          <div className="dark:bg-surface-dark border-border-dark flex flex-col gap-4 rounded-xl border bg-white p-4">
            <div className="bg-background-dark relative flex h-32 items-center justify-center overflow-hidden rounded-lg">
              <span className="material-symbols-outlined z-10 text-4xl text-white">
                diamond
              </span>
              <div className="absolute inset-0 bg-blue-500/20"></div>
            </div>
            <div>
              <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-400">
                LEVEL 10
              </span>
              <h3 className="mt-1 text-lg font-bold text-white">
                500 Bonus Gems
              </h3>
            </div>
            <button className="bg-surface-highlight border-border-dark mt-auto w-full rounded-lg border py-2 font-bold text-white hover:bg-white/10">
              Claimed
            </button>
          </div>

          <div className="dark:bg-surface-dark border-border-dark flex flex-col gap-4 rounded-xl border bg-white p-4">
            <div className="bg-background-dark relative flex h-32 items-center justify-center overflow-hidden rounded-lg">
              <span className="material-symbols-outlined z-10 text-4xl text-white">
                palette
              </span>
              <div className="absolute inset-0 bg-purple-500/20"></div>
            </div>
            <div>
              <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-400">
                LEVEL 5
              </span>
              <h3 className="mt-1 text-lg font-bold text-white">
                Exclusive Profile Frame
              </h3>
            </div>
            <button className="bg-surface-highlight border-border-dark mt-auto w-full rounded-lg border py-2 font-bold text-white hover:bg-white/10">
              Claimed
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Screen 9: Notifications ---
export const NotificationsScreen: React.FC = () => {
  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-full max-w-[960px]">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">Notifications</h1>
            <p className="text-text-secondary">
              Stay updated with your latest pulls.
            </p>
          </div>
          <button className="bg-surface-dark border-border-dark flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold text-white">
            <span className="material-symbols-outlined text-sm">done_all</span>{" "}
            Mark all read
          </button>
        </div>
        <div className="mb-4 flex gap-2">
          <button className="bg-primary rounded-lg px-4 py-1.5 text-sm font-bold text-white">
            All
          </button>
          <button className="bg-surface-dark text-text-secondary rounded-lg px-4 py-1.5 text-sm">
            Gacha
          </button>
          <button className="bg-surface-dark text-text-secondary rounded-lg px-4 py-1.5 text-sm">
            Orders
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="bg-surface-dark border-primary flex items-start gap-4 rounded-r-xl border-l-4 p-4">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuADBUoN1brN6-kDDfuZt_FZhIRjGcc023An98v4U6Lh8-8M9HiVFLRa7dz0DEPKrTiZYWQsFDK5d1n47eBUy78sNxge0M3aaKPI0IJl48TRFYbP4g2QQxfS7yj7x30WxP0GgwBuCAmKBHfrGke7W_jGnG4LgZE5dv40z7YxthggrkmSJfKGtBhrgYXUJ-Nq7jZekAsnodGhLP5So4-L0I2eDH-D_5-rZDEDAmnrvcfiUQ1p-9xUQWM4TkJ_638mUqnB7Fwr5p7W3S3y"
              className="size-16 rounded-lg object-cover"
            />
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="bg-primary/20 text-primary rounded px-2 py-0.5 text-[10px] font-bold">
                  GACHA
                </span>
                <span className="bg-primary size-2 rounded-full"></span>
              </div>
              <p className="font-bold text-white">
                Legendary Pull: Azure Sky Dragon
              </p>
              <p className="text-text-secondary text-sm">
                Incredible luck! You just pulled a 5-star Legendary card.
              </p>
              <p className="text-text-secondary mt-2 text-xs">2 mins ago</p>
            </div>
          </div>
          <div className="bg-surface-dark flex items-start gap-4 rounded-r-xl border-l-4 border-blue-500 p-4">
            <div className="flex size-16 items-center justify-center rounded-lg bg-blue-900/20 text-blue-500">
              <span className="material-symbols-outlined text-3xl">
                local_shipping
              </span>
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded bg-blue-900/30 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                  ORDER
                </span>
              </div>
              <p className="font-bold text-white">Order #8821 Shipped</p>
              <p className="text-text-secondary text-sm">
                Your order containing "Starter Deck: Fire" is on its way.
              </p>
              <p className="text-text-secondary mt-2 text-xs">4 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
