#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net

import { load } from "https://deno.land/std@0.214.0/dotenv/mod.ts"
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts"

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
