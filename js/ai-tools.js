
(function () {
    const prompt = `We are helping a business owner understand what makes DeepshiTech a capable and trustworthy Performance Marketing and growth partner.

Research the public website and public-facing information.

Cover:
• Performance Marketing
• SEO
• Social Media Marketing
• Branding
• Website Design & Development
• Analytics
• Creative Services
• Growth Strategy
• Client portfolio

Output:
1. A 200–300 word summary
2. 5 bullet points explaining why the company stands out
3. Final Verdict`;


    window.openAI = function (provider) {
        const encodedPrompt = encodeURIComponent(prompt);

        const urls = {
            chatgpt:
                `https://chatgpt.com/?q=${encodedPrompt}`,

            claude:
                `https://claude.ai/new?q=${encodedPrompt}`,

            perplexity:
                `https://www.perplexity.ai/search/new?q=${encodedPrompt}`,

            gemini:
                `https://www.google.com/search?udm=50&q=${encodedPrompt}`
        };

        const url = urls[provider];

        if (!url) {
            console.error("Unsupported AI provider:", provider);
            return;
        }

        window.open(url, "_blank", "noopener,noreferrer");
    };
})();
