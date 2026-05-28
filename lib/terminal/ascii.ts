export const NEOFETCH_LOGO = String.raw`
       /\
      /  \         vaibhav@portfolio
     / /\ \        ─────────────────
    / /  \ \       os      arch (x86_64)
   / /____\ \      kernel  6.13.4-arch1-1
  /          \     wm      hyprland
 /   ../      \    shell   zsh + starship
/______________\   editor  neovim (lazyvim)
                   term    kitty
                   font    ibm plex mono
                   uptime  ~3 years coding
                   cpu     ryzen 5
                   gpu     webgpu (browser)
                   memory  human / 8gb-ish
`.trim()

export const COFFEE = String.raw`
       (
        )
     .ooo
    o   o
   _:    \____
  /             \
 /  brewing...  /
'--__________--'
`.trim()

export const COW = (msg: string) => {
  const top = '_'.repeat(msg.length + 2)
  const bot = '-'.repeat(msg.length + 2)
  return [
    ` ${top} `,
    `< ${msg} >`,
    ` ${bot} `,
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
  ].join('\n')
}

export const FORTUNES = [
  'the best code is no code at all.',
  'premature optimization is the root of all evil.',
  'there are only two hard things in computer science: cache invalidation, naming things, and off-by-one errors.',
  'rm -rf is not a backup strategy.',
  'every program attempts to expand until it can read mail.',
  'the cheapest, fastest, and most reliable components are those that aren\'t there.',
  'weeks of coding can save hours of planning.',
  'if it works in production, don\'t touch it.',
]

export const MOTD = [
  '$ welcome to vaibhav\'s portfolio terminal.',
  '$ try `help` or `ollama run qwen "who are you"`.',
  '$ tip: run `fullscreen` (or press F11) for the full experience.',
]
