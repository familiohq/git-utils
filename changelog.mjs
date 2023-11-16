#!/usr/bin/env zx

// require installation of google/zx
// USAGE:
// 1. cd into folder with checked out git repositories
// 2. execute `changelog.mjs`
//
// EXAMPLE:
// zx changelog.mjs --since="1 month ago" --repositories="my-repo-1,my-repo-2"
//
// OPTIONS:
// --since: since when to generate changelog (default: 1 month ago)
// --repositories: comma separated list of repositories to generate changelog for (default: all repositories in current folder)

import { argv, chalk, fs } from 'zx'

$.verbose = false

const SINCE = argv.since || '1 month ago'

const PREFIXES = [
  '🎨',
  ':art:',
  '⚡️',
  ':zap:',
  '🔥',
  ':fire:',
  '🐛',
  ':bug:',
  '🚑',
  ':ambulance:',
  '✨',
  ':sparkles:',
  '📝',
  ':memo:',
  '🚀',
  ':rocket:',
  '💄',
  ':lipstick:',
  '🎉',
  ':tada:',
  '✅',
  ':white_check_mark:',
  '🔒',
  ':lock:',
  '🔖',
  ':bookmark:',
  '🚨',
  ':rotating_light:',
  '🚧',
  ':construction:',
  '💚',
  ':green_heart:',
  '⬇️',
  ':arrow_down:',
  '⬆️',
  ':arrow_up:',
  '📌',
  ':pushpin:',
  '👷',
  ':construction_worker:',
  '📈',
  ':chart_with_upwards_trend:',
  '♻️',
  ':recycle:',
  '➕',
  ':heavy_plus_sign:',
  '➖',
  ':heavy_minus_sign:',
  '🔧',
  ':wrench:',
  '🔨',
  ':hammer:',
  '🌐',
  ':globe_with_meridians:',
  '✏️',
  ':pencil2:',
  '💩',
  ':poop:',
  '⏪',
  ':rewind:',
  '🔀',
  ':twisted_rightwards_arrows:',
  '📦',
  ':package:',
  '👽',
  ':alien:',
  '🚚',
  ':truck:',
  '📄',
  ':page_facing_up:',
  '💥',
  ':boom:',
  '🍱',
  ':bento:',
  '♿️',
  ':wheelchair:',
  '💡',
  ':bulb:',
  '🍻',
  ':beers:',
  '💬',
  ':speech_balloon:',
  '🗃',
  ':card_file_box:',
  '🔊',
  ':loud_sound:',
  '🔇',
  ':mute:',
  '👥',
  ':busts_in_silhouette:',
  '🚸',
  ':children_crossing:',
  '🏗',
  ':building_construction:',
  '📱',
  ':iphone:',
  '🤡',
  ':clown_face:',
  '🥚',
  ':egg:',
  '🙈',
  ':see_no_evil:',
  '📸',
  ':camera_flash:',
  '⚗',
  ':alembic:',
  '🔍',
  ':mag:',
  '🏷️',
  ':label:',
  '🌱',
  ':seedling:',
  '🚩',
  ':triangular_flag_on_post:',
  '🥅',
  ':goal_net:',
  '💫',
  ':dizzy:',
  '🗑',
  ':wastebasket:',
  '🛂',
  ':passport_control:',
  '🩹',
  ':adhesive_bandage:',
  '🧐',
  ':monocle_face:',
  '⚰️',
  ':coffin:'
]

const baseDirectory = (await $`pwd`).toString().trim()

const repositories =
  argv.repositories?.split(',') ||
  (await $`ls -d */`)
    .toString()
    .split('\n')
    .filter(a => a)

console.log(`# CHANGELOG (since ${SINCE})`)
console.log()

for (const repository of repositories) {
  try {
    cd(`${baseDirectory}/${repository}`)

    if (!(await fs.exists(`${baseDirectory}/${repository}/.git`))) {
      // console.debug(`Skipping ${repository} as it is not a git repository.`)
      continue
    }

    let origin = 'master'
    const hasMasterBranch = (
      (await $`git branch --list master`).toString() || ''
    ).includes(origin)
    if (!hasMasterBranch) {
      // console.debug(`Fallback ${repository} to develop branch, since it has no master branch.`)
      origin = 'develop'
    }
    const entries = (
      (
        await $`git log origin/${origin} --since="${SINCE}" --pretty=format:'%s (%as)'`
      ).toString() || ''
    )
      .split('\n')
      .filter(a => a)
      .map(a => a.trim())
    if (entries.length === 0) continue

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
    const fire = []
    const other = []

    patchedEntries.forEach(entry => {
      if (['✨', '⚡️'].some(a => entry.startsWith(a))) {
        sparkles.push(entry.trim())
      } else if (['🐛', '🚑', '🩹', '✏️'].some(a => entry.startsWith(a))) {
        bug.push(entry.trim())
      } else if (['💄', '🎨', '♿️'].some(a => entry.startsWith(a))) {
        lipstick.push(entry.trim())
      } else if (['🔥'].some(a => entry.startsWith(a))) {
        fire.push(entry.trim())
      } else {
        other.push(entry.trim())
      }
    })

    if (
      sparkles.length +
        bug.length +
        lipstick.length +
        fire.length +
        other.length ===
      0
    )
      continue

    const sections = [
      { title: `New features (${sparkles.length})`, entries: sparkles },
      { title: `Bugfixes (${bug.length})`, entries: bug },
      { title: `UI fixes (${lipstick.length})`, entries: lipstick },
      { title: `Cleanup (${fire.length})`, entries: fire },
      { title: `Other changes (${other.length})`, entries: other }
    ].filter(s => s.entries.length > 0)

    console.log(chalk.blue(`## ${repository.replace('/', '')}`))
    console.log()
    console.log(
      sections
        .map(s => `### ${s.title}\n    ${s.entries.join('\n    ')}\n`)
        .join('\n')
    )
  } catch (p) {
    console.error(
      `!!! Failed to run through ${repository}. ${p.exitCode}: ${p.stderr}`,
      p
    )
  }
}
