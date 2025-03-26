import WDIOReporter, { TestStats } from '@wdio/reporter';
import { Options } from '@wdio/types/build/Reporters';

export default class DurationReporter extends WDIOReporter {
    constructor(options: Partial<Options>) {
        options = Object.assign(options, {stdout: true});
        super(options);
    }

    start: number = 0

    onTestStart(_testStats: TestStats) {
        this.start = Date.now()
    }

    onTestEnd(testStats: TestStats) {
        this.write(`Test "${testStats.title}" finished in ${Date.now() - this.start} ms\n`)
        if (this.options.showState) {
            this.write(`Test ${testStats.state}\n`)
        }
    }
}