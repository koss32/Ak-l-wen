// Disabled bridge boundary. A public requestId can never be used to retrieve or
// associate a web request. Enable only after an Upstash domain adapter provides a
// server-side ownership proof and atomic one-use link creation.
export default function handler(_req,res){res.setHeader('Cache-Control','no-store');res.status(503).json({ok:false,code:'not_configured'});}
