// repo/scripts/part.js
export function greetUser(name, context) {
    const site = context.siteId ?? 'unknown-site';
    console.log(`[${site}] Hello, ${name}!`);
}
