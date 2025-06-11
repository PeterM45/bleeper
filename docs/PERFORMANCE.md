# Performance and Computational Cost Guide

## Overview

Bleeper is designed for high-performance text filtering with minimal computational overhead. However, like any text processing library, computational costs scale with text size and complexity.

## Performance Characteristics

### Typical Performance (Node.js 18+)

- **Small text** (< 1KB): 50K-800K+ operations/sec
- **Medium text** (1-10KB): 10K-50K operations/sec
- **Large text** (10KB+): 1K-10K operations/sec

### Computational Complexity

- **Best case**: O(n) single pass with early termination
- **Average case**: O(n) with character substitution processing
- **Worst case**: O(n × m) where m is average word length

## Cost Optimization Strategies

### 1. Use `contains()` for Detection Only

```javascript
// ✅ Faster - just detection
if (contains(text)) {
  // Handle profanity case
}

// ❌ Slower - creates filtered copy
const filtered = filter(text);
```

### 2. Process in Chunks for Large Text

```javascript
// ✅ Process large text in chunks to avoid CPU spikes
function filterLargeText(text, chunkSize = 10000) {
  if (text.length <= chunkSize) {
    return filter(text);
  }

  let result = '';
  for (let i = 0; i < text.length; i += chunkSize) {
    result += filter(text.slice(i, i + chunkSize));
  }
  return result;
}
```

### 3. Use Async Processing for Very Large Texts

```javascript
// ✅ Non-blocking processing for large texts
async function filterLargeTextAsync(text, chunkSize = 5000) {
  if (text.length <= chunkSize) {
    return filter(text);
  }

  let result = '';
  for (let i = 0; i < text.length; i += chunkSize) {
    result += filter(text.slice(i, i + chunkSize));

    // Yield control to event loop every chunk
    if (i % (chunkSize * 10) === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
  }
  return result;
}
```

## Hosting Cost Considerations

### Serverless Functions (AWS Lambda, Vercel, etc.)

- **Memory**: ~10-50MB for typical usage
- **CPU**: Scales linearly with text size
- **Recommended**: Use `contains()` for pre-filtering before expensive operations

### Traditional Servers

- **CPU usage**: Minimal for small-medium texts
- **Memory**: Constant ~1-5MB baseline
- **Scalability**: Excellent for concurrent requests

### Edge Computing (Cloudflare Workers, etc.)

- **CPU limits**: Process in small chunks (< 5KB recommended)
- **Memory limits**: Very efficient, minimal overhead
- **Cold starts**: Fast initialization due to zero dependencies

## Benchmarking Your Use Case

Run the included benchmark to test performance with your specific data:

```bash
npm run benchmark
```

Monitor resource usage:

```bash
npm run perf  # Lightweight performance test
```

## Production Recommendations

1. **Cache results** for frequently filtered content
2. **Use `contains()` first** to avoid unnecessary filtering
3. **Process large texts asynchronously** to prevent blocking
4. **Monitor CPU usage** in production and adjust chunk sizes
5. **Consider rate limiting** for user-generated content filtering

## Resource Monitoring

```javascript
// Example: Monitor processing time
function monitoredFilter(text) {
  const start = performance.now();
  const result = filter(text);
  const duration = performance.now() - start;

  if (duration > 100) {
    // Log slow operations
    console.warn(
      `Slow filter operation: ${duration}ms for ${text.length} chars`
    );
  }

  return result;
}
```

## FAQ

**Q: Will this increase my hosting costs significantly?**
A: For typical use cases (user comments, chat messages), the impact is minimal. For bulk processing of large documents, consider chunking and async processing.

**Q: How does it compare to other profanity filters?**
A: Bleeper is optimized for speed and minimal dependencies. It typically uses 2-10x less CPU than regex-based solutions.

**Q: Should I be concerned about CPU spikes?**
A: For texts under 10KB, CPU usage is negligible. For larger texts, use the chunking strategies above.
