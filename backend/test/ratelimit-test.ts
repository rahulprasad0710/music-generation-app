// ratelimit-test.ts
const API_URL = "http://localhost:8000/api/prompts";
const TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidXNlclR5cGUiOiJjcmVkZW50aWFscyIsImxvZ2luVHlwZSI6ImNyZWRlbnRpYWxzIiwiaWF0IjoxNzc2NjAxMTY1LCJleHAiOjE3NzY2MDIwNjV9.IpPDkuBLDJR1UFzUlixFTS9pgw3_gC6SYryZlhQp7WU";

const TOTAL_REQUESTS = 50;
const CONCURRENT_REQUESTS = 10; // fire 10 at a time
const DELAY_BETWEEN_BATCHES_MS = 0; // 0 = as fast as possible

interface Result {
    requestNumber: number;
    status: number;
    statusText: string;
    responseTime: number;
    rateLimited: boolean;
    body: any;
}

async function sendRequest(requestNumber: number): Promise<Result> {
    const start = Date.now();

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            Accept: "application/json, text/plain, */*",
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
            Origin: "http://localhost:3000",
            Referer: "http://localhost:3000/",
        },
        body: JSON.stringify({ prompt: "testff", priority: 1 }),
    });

    const responseTime = Date.now() - start;
    let body: any;

    try {
        body = await response.json();
    } catch {
        body = await response.text();
    }

    return {
        requestNumber,
        status: response.status,
        statusText: response.statusText,
        responseTime,
        rateLimited: response.status === 429,
        body,
    };
}

async function runBatch(
    batchNumbers: number[],
    results: Result[],
): Promise<void> {
    const batchResults = await Promise.all(
        batchNumbers.map((num) => sendRequest(num)),
    );
    results.push(...batchResults);
}

async function runRateLimitTest() {
    console.log(`🚀 Starting rate limit test`);
    console.log(`   Total requests: ${TOTAL_REQUESTS}`);
    console.log(`   Concurrency: ${CONCURRENT_REQUESTS}`);
    console.log(`   Target: ${API_URL}\n`);

    const results: Result[] = [];
    const requestNumbers = Array.from(
        { length: TOTAL_REQUESTS },
        (_, i) => i + 1,
    );

    // Process in batches
    for (let i = 0; i < requestNumbers.length; i += CONCURRENT_REQUESTS) {
        const batch = requestNumbers.slice(i, i + CONCURRENT_REQUESTS);
        console.log(
            `📤 Firing batch ${Math.floor(i / CONCURRENT_REQUESTS) + 1}: requests ${batch[0]}-${batch[batch.length - 1]}`,
        );

        await runBatch(batch, results);

        const batchResults = results.slice(-batch.length);
        batchResults.forEach((r) => {
            const icon = r.rateLimited ? "🚫" : r.status === 200 ? "✅" : "⚠️";
            console.log(
                `  ${icon} #${r.requestNumber} → ${r.status} (${r.responseTime}ms)`,
            );
        });

        if (DELAY_BETWEEN_BATCHES_MS > 0) {
            await new Promise((res) =>
                setTimeout(res, DELAY_BETWEEN_BATCHES_MS),
            );
        }
    }

    // Summary
    const successful = results.filter((r) => r.status === 200).length;
    const rateLimited = results.filter((r) => r.rateLimited).length;
    const errors = results.filter(
        (r) => r.status !== 200 && r.status !== 429,
    ).length;
    const avgResponseTime =
        results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

    console.log(`\n📊 Results Summary:`);
    console.log(`   ✅ Successful (200):     ${successful}`);
    console.log(`   🚫 Rate Limited (429):   ${rateLimited}`);
    console.log(`   ⚠️  Other errors:         ${errors}`);
    console.log(`   ⏱️  Avg response time:    ${avgResponseTime.toFixed(0)}ms`);

    if (rateLimited > 0) {
        const firstRateLimited = results.find((r) => r.rateLimited);
        console.log(
            `\n⚡ Rate limit hit at request #${firstRateLimited?.requestNumber}`,
        );
        console.log(`   Response:`, firstRateLimited?.body);
    } else {
        console.log(
            `\n✅ No rate limiting detected in ${TOTAL_REQUESTS} requests`,
        );
    }
}

runRateLimitTest().catch(console.error);
