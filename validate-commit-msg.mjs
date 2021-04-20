// https://chris.beams.io/posts/git-commit/
// https://gitmoji.dev

import fs from 'fs'

const STRICT = false

let [file, message] = process.argv.slice(2)
// let message = `:sparkles: Allow users to sign up using Facebook

// This is a test
// 01234567890123456789012345678901234567890123456789012345678901256789123
// line2
// line3`

const PREFIXES = [
  '🎨', ':art:', '⚡️', ':zap:', '🔥', ':fire:', '🐛', ':bug:',
  '🚑', ':ambulance:', '✨', ':sparkles:', '📝', ':memo:', '🚀:rocket:',
  '💄', ':lipstick:', '🎉:tada:', '✅', ':white_check_mark:', '🔒', ':lock:',
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

let [subject, , ...body] = message.split('\n')

if (subject.startsWith('Merge branch ')) {
  // prefix with merge gitmoji in case a standard merge message is found without an gitmoji
  subject = `🔀 ${subject}`
}

if (subject.startsWith('Revert ')) {
  // prefix with revert gitmoji in case a standard revert message is found without an gitmoji
  subject = `⏪️ ${subject}`
}

const gitmoji = PREFIXES.find(p => subject.startsWith(p))
if (gitmoji) {
  console.log('✅ Message is correctly prefixed with an gitmoji')

  if (gitmoji.startsWith(':')) {
    const idx = PREFIXES.findIndex(p => subject.startsWith(p))
    subject = subject.replace(gitmoji, PREFIXES[idx - 1])
    console.log(`🧹 Replacing gitmoji label "${gitmoji}" with emoji ${PREFIXES[idx - 1]}`)
  }

  // 1. Separate subject from body with a blank line
  // TDB

  // 2. Limit the subject line to 50 characters
  if (subject.length > 50) {
    console.log(`👮‍♀️ Message is ${subject.length} characters but ought to be below 50`)
    if (STRICT) process.exit(1)
  }

  // 3. Capitalize the subject line
  let [emoji, firstWord, ...tail] = subject.split(' ')
  if (emoji && firstWord && firstWord.length > 1) {
    subject = `${emoji} ${firstWord[0].toUpperCase() + firstWord.slice(1)}${tail.length > 0 ? ' ' : ''}${tail.join(' ')}`
  }

  // 4. Do not end the subject line with a period
  if (subject.endsWith('.')) {
    console.log(`🧹 Removing period from end of subject line`)
    subject = subject.slice(0, -1)
  }

  // 5. Use the imperative mood in the subject line
  if (['fixed', 'minor', 'removed', 'applied', 'adjusted', 'added', 'updated'].includes(firstWord.toLowerCase())) {
    console.log(`👮 Use imperative mood instead i.e. you should be able to complete this line`)
    console.log(`   "If applied, this commit will ..."`)
    if (STRICT) process.exit(1)
  }

  // 6. Wrap the body at 72 characters
  if (body.find(b => b.length > 72)) {
    console.log(`👮‍♂️ One or more lines in your body have a length above 72 characters`)
    if (STRICT) process.exit(1)
  }

  // 7. Use the body to explain what and why vs. how
  // TBD

  message = `${subject}${body.length > 0 ? `\n\n${body.join('\n')}` : ''}`
  fs.writeFileSync(file, message, 'utf8')

} else {
  console.log('💩 Commit message not prefixed with a gitmoji')
  process.exit(1)
}
