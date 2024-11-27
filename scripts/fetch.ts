#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net

import { load } from "jsr:@std/dotenv@0.225.2"
import { z } from "npm:zod@3.23.8"

const EnvSchema = z.object({
  NETATMO_DEVICE_ID: z.string().min(1),
  NETATMO_ACCESS_TOKEN: z.string().min(1),
})
const env = await EnvSchema.parseAsync(await load())

const NETATMO_API_ENDPOINT = "https://api.netatmo.com/api/getmeasure"
const PARAMETERS = ["temperature", "humidity", "CO2", "noise", "pressure"]

for (const parameter of PARAMETERS) {
  console.log(`Fetching ${parameter}`)

  const searchParams = new URLSearchParams({
    device_id: env.NETATMO_DEVICE_ID,
    scale: "30min",
    type: parameter,
    optimize: "false",
    realtime: "false",
  })
  const headers = new Headers({
    "Content-type": "application/json",
    Authorization: `Bearer ${env.NETATMO_ACCESS_TOKEN}`,
  })

  const res = await fetch(`${NETATMO_API_ENDPOINT}?${searchParams.toString()}`, { headers })
  const data = await res.json()

  await Deno.writeTextFile(`./data/${parameter}.json`, JSON.stringify(data, null, 2))
}

console.log("Done")
