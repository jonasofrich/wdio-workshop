import allure from "allure-commandline";
import { promises, existsSync } from 'fs';
import path from 'path';

export default class CustomService {

    outputDir: string

    constructor(serviceOptions: { outputDir: string; }, _capabilities: any, _config: any) {
        this.outputDir = serviceOptions.outputDir;
    }

    async onPrepare(_config: any, _capabilities: any) {
        try {
            const resultPath = "./allure-results";
            const reportPath = this.outputDir;
            if (!existsSync(reportPath)) {
                await promises.mkdir(reportPath);
            }
            const resultFiles = await promises.readdir(resultPath);
            const reportFiles = await promises.readdir(reportPath);
            await Promise.all(
                resultFiles.map(file => promises.unlink(path.join(resultPath, file)))
            );
            await Promise.all(
                reportFiles.map(file => promises.unlink(path.join(reportPath, file)))
            );
            console.log('All files deleted successfully.');
        } catch (error) {
            console.error('Error deleting files:', error);
        }
    }


    async onComplete(_exitCode: any, config: any, _capabilities: any) {
        const reportError = new Error('Could not generate Allure report')
        const generation = allure(['generate', `-o ${this.outputDir}`, '--clean'])
        return new Promise<void>((resolve, reject) => {
            const generationTimeout = setTimeout(
                () => reject(reportError),
                5000)

            generation.on('exit', function(exitCode: number) {
                clearTimeout(generationTimeout)

                if (exitCode !== 0) {
                    return reject(reportError)
                }

                console.log('Allure report successfully generated')
                resolve()
            })
        })
    }
}