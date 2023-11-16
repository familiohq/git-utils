#!/usr/bin/env zx

// require installation of google/zx

import { argv, fetch, fs } from 'zx'

$.verbose = false

async function postToDiscord (webhookUrl, payload) {
  // Split message into 2000 character chunks
  const chunks = payload.match(/[\s\S]{1,2000}/g) || []

  for (let chunk of chunks) {
    const content = {
      content: chunk,
      username: 'Techlynx'
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Sleep for 1.5 second to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 1500))
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  console.log('Message posted successfully')
}

async function postToDiscordWithFile (webhookUrl, payload, filePath) {
  const boundary = `----WebKitFormBoundary${Math.random()
    .toString(36)
    .substring(2, 15)}`
  const fileData = fs.readFileSync(filePath)
  const fileName = filePath.split('/').pop()

  // Construct the multipart/form-data body
  let body = `--${boundary}\r\nContent-Disposition: form-data; name="content"\r\n\r\n${payload}\r\n`
  body += `--${boundary}\r\nContent-Disposition: form-data; name="username"\r\n\r\nTechlynx\r\n`
  body += `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`
  body += fileData
  body += `\r\n--${boundary}--`

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      }
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.log('response', errorBody)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    console.log('Message posted successfully with file')
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

const WEBHOOK_URL = argv['webhook-url']
let changes

changes = (await $`./git-utils/changelog.mjs --since="1 week ago" > ./changes-past-week.md`).toString()
postToDiscordWithFile(WEBHOOK_URL, 'This is our changelog throughout our repos :fire:', './changes-past-week.md')

// changes = (await $`./git-utils/changelog.mjs --repositories api`).toString()
// postToDiscord(WEBHOOK_URL, changes)

// changes = (
//   await $`./git-utils/changelog.mjs --repositories partner-app`
// ).toString()
// postToDiscord(WEBHOOK_URL, changes)

// changes = (
//   await $`./git-utils/changelog.mjs --repositories client-app`
// ).toString()
// postToDiscord(WEBHOOK_URL, changes)

// changes = (
//   await $`./git-utils/changelog.mjs --repositories templ8-ui`
// ).toString()
// postToDiscord(WEBHOOK_URL, changes)

// changes = (
//   await $`./git-utils/changelog.mjs --repositories templ8-helpers`
// ).toString()
// postToDiscord(WEBHOOK_URL, changes)
