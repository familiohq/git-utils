#!/usr/bin/env zx

// require installation of google/zx
// USAGE:
// 1. cd into folder with checked out git repositories
// 2. execute `changelog.mjs`

$.verbose = false

const SINCE = '1 month ago'

const PREFIXES = [
  '🎨', ':art:', '⚡️', ':zap:', '🔥', ':fire:', '🐛', ':bug:',
  '🚑', ':ambulance:', '✨', ':sparkles:', '📝', ':memo:', '🚀', ':rocket:',
  '💄', ':lipstick:', '🎉', ':tada:', '✅', ':white_check_mark:', '🔒', ':lock:',
  '🔖', ':bookmark:', '🚨', ':rotating_light:', '🚧', ':construction:', '💚', ':green_heart:',
  '⬇️', ':arrow_down:', '⬆️', ':arrow_up:', '📌', ':pushpin:', '👷', ':construction_worker:',
  '📈', ':chart_with_upwards_trend:', '♻️', ':recycle:', '➕', ':heavy_plus_sign:', '➖', ':heavy_minus_sign:',
  '🔧', ':wrench:', '🔨', ':hammer:', '🌐', ':globe_with_meridians:', '✏️', ':pencil2:',
  '💩', ':poop:', '⏪', ':rewind:', '🔀', ':twisted_rightwards_arrows:', '📦', ':package:',
  '👽', ':alien:', '🚚', ':truck:', '📄', ':page_facing_up:', '💥', ':boom:',
  '🍱', ':bento:', '♿️', ':wheelchair:', '💡', ':bulb:', '🍻', ':beers:',
  '💬', ':speech_balloon:', '🗃', ':card_file_box:', '🔊', ':loud_sound:', '🔇', ':mute:',
  '👥', ':busts_in_silhouette:', '🚸', ':children_crossing:', '🏗', ':building_construction:', '📱', ':iphone:',
  '🤡', ':clown_face:', '🥚', ':egg:', '🙈', ':see_no_evil:', '📸', ':camera_flash:',
  '⚗', ':alembic:', '🔍', ':mag:', '🏷️', ':label:', '🌱', ':seedling:',
  '🚩', ':triangular_flag_on_post:', '🥅', ':goal_net:', '💫', ':dizzy:', '🗑', ':wastebasket:',
  '🛂', ':passport_control:', '🩹', ':adhesive_bandage:', '🧐', ':monocle_face:', '⚰️', ':coffin:'
]

console.log(`# CHANGELOG`)
console.log(`Full changelog across projects since ${SINCE}.`)
console.log()

const repositories = (await $`ls -d */`).toString().split('\n').filter(a => a)
repositories.forEach(async repository => {
  try {
    cd(repository)
    const entries = ((await $`git log origin/master --since="${SINCE}" --pretty=format:'%s (%as)'`).toString() || '').split('\n').filter(a => a).map(a => a.trim())
    if (entries.length === 0) return

    const patchedEntries = entries.map(entry => {
      const gitmoji = PREFIXES.find(p => entry.startsWith(p))
      if (gitmoji?.startsWith(':')) {
        const idx = PREFIXES.findIndex(p => entry.startsWith(p))
        entry = entry.replace(gitmoji, PREFIXES[idx - 1])
      }
      return entry
    })

    const sparkles = []
    const bug = []
    const lipstick = []
    const other = []

    patchedEntries.forEach(entry => {
      if (['✨', '⚡️'].some(a => entry.startsWith(a))) {
        sparkles.push(entry.trim())
      } else if (['🐛', '🚑', '🩹', '✏️'].some(a => entry.startsWith(a))) {
        bug.push(entry.trim())
      } else if (['💄', '🎨', '♿️'].some(a => entry.startsWith(a))) {
        lipstick.push(entry.trim())
      } else {
        other.push(entry.trim())
      }
    })

    if ((sparkles.length + bug.length + lipstick.length + other.length) === 0) return

    const sections = [
      { title: 'New features', entries: sparkles },
      { title: 'Bugfixes', entries: bug },
      { title: 'UI fixes', entries: lipstick },
      { title: 'Other changes', entries: other },
    ].filter(s => s.entries.length > 0)

    console.log(`## ${repository.replace('/', '')}`)
    console.log()
    console.log(sections.map(s => `### ${s.title}\n    ${s.entries.join('\n    ')}\n`).join('\n'))
  } catch (p) {
    console.error(`!!! Failed to run through ${repository}. ${p.exitCode}: ${p.stderr}`)
  }
})
