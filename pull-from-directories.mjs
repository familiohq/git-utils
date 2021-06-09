#!/usr/bin/env zx

// require installation of google/zx

$.verbose = false

console.log(`Pulling in all directories`)

const repositories = (await $`ls -d */`).toString().split('\n').filter(a => a)
await Promise.all(repositories.map(async repository => {
  cd(repository)
  console.log(`> ${repository}`)
  return $`git pull`
}))

