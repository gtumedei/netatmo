#!/usr/bin/env -S deno run --allow-read --allow-write

import { format } from "jsr:@std/datetime@0.225.2"

type Data = {
  body: Record<string, number[]>
}

const PARAMETERS = ["temperature", "humidity", "CO2", "noise", "pressure"]

const values = {} as Record<string, Record<string, number[]>>

for (const parameter of PARAMETERS) {
  const json = JSON.parse(await Deno.readTextFile(`./data/${parameter}.json`)) as Data
  values[parameter] = json.body
}

const csvHeader = "timestamp,temperature,humidity,CO2,noise,pressure\n"
let csvContent = csvHeader

const timestamps = Object.keys(values.temperature)

for (const timestamp of timestamps) {
  const formattedDate = format(new Date(Number(timestamp) * 1000), "yyyy-MM-dd HH:mm:ss")
  const temperature = values.temperature[timestamp]?.[0]
  const humidity = values.humidity[timestamp]?.[0]
  const CO2 = values.CO2[timestamp]?.[0]
  const noise = values.noise[timestamp]?.[0]
  const pressure = values.pressure[timestamp]?.[0]
  if (!temperature || !humidity || !CO2 || !noise || !pressure) {
    console.error(`Some parameters were not found for timestamp ${timestamp} - ${formattedDate}`)
  }
  csvContent += `${formattedDate},${temperature},${humidity},${CO2},${noise},${pressure}\n`
}

await Deno.writeTextFile("./data/data.csv", csvContent)

console.log("Done")
