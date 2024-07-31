import { pipeline } from '@xenova/transformers';

class MyTranslationPipeline {
    static task = 'translation';
    static model = 'Xenova/nllb-200-distilled-600M';
    static instance = null;
    static loading = false;
    static progressCallback = null;
    static queue = [];

    static async getInstance(progress_callback = null) {
        if (this.instance !== null) {
            return this.instance;
        }

        if (progress_callback) {
            this.progressCallback = progress_callback;
        }

        if (this.loading) {
            return new Promise((resolve) => {
                this.queue.push(resolve);
            });
        }

        this.loading = true;
        try {
            this.instance = await pipeline(this.task, this.model, { progress_callback: this.progressCallback });
            this.loading = false;
            this.queue.forEach(resolve => resolve(this.instance));
            this.queue = [];
        } catch (err) {
            this.loading = false;
            this.queue = [];
            throw err;
        }

        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    let translator;
    try {
        translator = await MyTranslationPipeline.getInstance(progress => {
            self.postMessage({ status: 'progress', ...progress });
        });
    } catch (error) {
        self.postMessage({ status: 'error', message: error.message });
        return;
    }

    let output;
    try {
        output = await translator(event.data.text, {
            tgt_lang: event.data.tgt_lang,
            src_lang: event.data.src_lang,

            callback_function: (x) => {
                self.postMessage({
                    status: 'update',
                    output: translator.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true })
                });
            }
        });
    } catch (error) {
        self.postMessage({ status: 'error', message: error.message });
        return;
    }

    self.postMessage({
        status: 'complete',
        output
    });
});
