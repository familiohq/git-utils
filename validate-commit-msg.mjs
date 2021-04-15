import fs from 'fs'

let [file, message] = process.argv.slice(2)

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

const gitmoji = PREFIXES.find(p => message.startsWith(p))
if (gitmoji) {
  console.info('✅ Message is correctly prefixed with an gitmoji')

  if (gitmoji.startsWith(':')) {
    const idx = PREFIXES.findIndex(p => message.startsWith(p))
    message = message.replace(gitmoji, PREFIXES[idx - 1])
    console.info('🧹 Replacing label with emoji')

    fs.writeFileSync(file, message, 'utf8')
  }
  
} else {
  console.error('💩 Commit message not prefixed with a gitmoji')
  process.exit(1)
}
