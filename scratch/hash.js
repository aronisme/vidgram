import crypto from 'crypto';
const key = 'sk_live_IFKiy07kp7MsybJzJ6LcAdjPnVI5f6qVfiDsc_ht2L0';
const hash = crypto.createHash('sha256').update(key).digest('hex');
console.log(hash);
