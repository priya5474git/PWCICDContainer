const fs = require('fs');
const path = require('path');

class ReadableReporter {
  constructor(options = {}) {
    this.outputFile = options.outputFile || 'test-results/readable-summary.txt';
    this.results = [];
  }

  onTestEnd(test, result) {
    const cleanedTitle = test.titlePath().filter((segment) => segment && segment.trim() !== '').join(' > ');
    this.results.push({
      title: cleanedTitle,
      status: result.status,
      durationMs: result.duration,
      error: result.error ? result.error.message : null
    });
  }

  onEnd(result) {
    const total = this.results.length;
    const passed = this.results.filter((r) => r.status === 'passed').length;
    const failed = this.results.filter((r) => r.status === 'failed').length;
    const skipped = this.results.filter((r) => r.status === 'skipped').length;

    const lines = [];
    lines.push('Playwright Test Summary');
    lines.push('======================');
    lines.push(`Overall status: ${result.status}`);
    lines.push(`Total tests: ${total}`);
    lines.push(`Passed: ${passed}`);
    lines.push(`Failed: ${failed}`);
    lines.push(`Skipped: ${skipped}`);
    lines.push('');
    lines.push('Per-test details');
    lines.push('----------------');

    for (const item of this.results) {
      lines.push(`- ${item.title}`);
      lines.push(`  status: ${item.status}`);
      lines.push(`  duration: ${item.durationMs} ms`);
      if (item.error) {
        lines.push(`  error: ${item.error}`);
      }
    }

    const outputPath = path.resolve(this.outputFile);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8');
  }
}

module.exports = ReadableReporter;
