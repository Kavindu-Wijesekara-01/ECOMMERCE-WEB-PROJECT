// lib/rateLimit.ts

// මේකෙන් මතක තියාගන්නවා කවුද කොච්චර රික්වෙස්ට් එව්වද කියලා
const rateLimitMap = new Map();

export default function rateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  const windowStart = now - windowMs;

  let requestData = rateLimitMap.get(ip) || { count: 0, startTime: now };

  // කාලය ඉවර නම් අලුතෙන් ගණන් කරන්න පටන් ගන්නවා
  if (requestData.startTime < windowStart) {
    requestData = { count: 1, startTime: now };
  } else {
    // නැත්නම් රික්වෙස්ට් ගාණ එකකින් වැඩි කරනවා
    requestData.count++;
  }

  rateLimitMap.set(ip, requestData);

  // සීමාව පැනලා නැත්නම් True යවනවා, පැනලා නම් False යවනවා
  return requestData.count <= limit;
}