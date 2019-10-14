const pollenium = require('pollenium-anemone/node/')
const Worker = require('tiny-worker')
const WebSocket = require('isomorphic-ws')
const wrtc = require('wrtc')

const client = new pollenium.Client({
  signalingServerUrls: [
    `wss://begonia-us-1.herokuapp.com`,
    `wss://begonia-eu-1.herokuapp.com`,
  ],
  bootstrapOffersTimeout: 0,
  signalTimeout: 5,
  friendshipsMax: 6,
  Worker: Worker,
  WebSocket: WebSocket,
  wrtc: wrtc,
  hashcashWorkerUrl: `${__dirname}/node_modules/pollenium-anemone/node/hashcash-worker.js`
})
const applicationId = pollenium.Bytes.fromUtf8('pollenboard').getPaddedLeft(32)


async function sendMessage() {
  console.log('sendMessage')
  const missiveGenerator = new pollenium.MissiveGenerator(
    client,
    applicationId,
    pollenium.Bytes.fromUtf8(
      `Hi! I'm a bot using client 0x${client.nonce.getHex().substr(0, 8)}. I wrote this message at ${(new Date).getTime()}.`
    ),
    8
  )
  const missive = await missiveGenerator.fetchMissive()
  console.log('broadcast')
  missive.broadcast()
}

async function loopSendMessage() {
  await sendMessage()
  loopSendMessage()
}

loopSendMessage()
