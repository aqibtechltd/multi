// Tool categories and their data
const toolsData = {
    aiTools: [
        {
            name: 'AI Text Generator',
            description: 'Generate blog posts, articles, and creative content using AI.',
            icon: 'bi-file-text',
            link: '/tools/ai/text-generator.html',
            category: 'AI-Powered Tools'
        },
        {
            name: 'AI Image Generator',
            description: 'Create unique images from text descriptions using AI.',
            icon: 'bi-image',
            link: '/tools/ai/image-generator.html',
            category: 'AI-Powered Tools'
        },
        {
            name: 'AI Chatbot Assistant',
            description: 'Chat with an AI for general questions and support.',
            icon: 'bi-chat-dots',
            link: '/tools/ai/chatbot.html',
            category: 'AI-Powered Tools'
        },
        {
            name: 'AI Resume Builder',
            description: 'Create professional resumes with AI assistance.',
            icon: 'bi-file-person',
            link: '/tools/ai/resume-builder.html',
            category: 'AI-Powered Tools'
        },
        {
            name: 'AI Cover Letter Generator',
            description: 'Generate personalized cover letters for job applications.',
            icon: 'bi-envelope-paper',
            link: '/tools/ai/cover-letter.html',
            category: 'AI-Powered Tools'
        },
        {
            name: 'AI Email Generator',
            description: 'Write professional emails quickly with AI.',
            icon: 'bi-envelope',
            link: '/tools/ai/email-generator.html',
            category: 'AI-Powered Tools'
        },
        {
            name: 'AI Social Media Post Generator',
            description: 'Create engaging social media content using AI.',
            icon: 'bi-share',
            link: '/tools/ai/social-media-generator.html',
            category: 'AI-Powered Tools'
        },
        {
            name: 'AI Story Generator',
            description: 'Generate creative stories and poems with AI.',
            icon: 'bi-book',
            link: '/tools/ai/story-generator.html',
            category: 'AI-Powered Tools'
        },
        {
            name: 'AI Code Generator',
            description: 'Generate code snippets from natural language.',
            icon: 'bi-code-square',
            link: '/tools/ai/code-generator.html',
            category: 'AI-Powered Tools'
        },
        {
            name: 'AI Voice Generator',
            description: 'Convert text to natural-sounding speech.',
            icon: 'bi-mic',
            link: '/tools/ai/voice-generator.html',
            category: 'AI-Powered Tools'
        },
        {
            name: 'AI Background Remover',
            description: 'Remove image backgrounds automatically with AI.',
            icon: 'bi-image-fill',
            link: '/tools/ai/background-remover.html',
            category: 'AI-Powered Tools'
        },
        {
            name: 'AI Image Enhancer',
            description: 'Improve image quality using AI technology.',
            icon: 'bi-image-alt',
            link: '/tools/ai/image-enhancer.html',
            category: 'AI-Powered Tools'
        },
        {
            name: 'AI Art Style Transfer',
            description: 'Transform photos into different artistic styles.',
            icon: 'bi-palette',
            link: '/tools/ai/art-style-transfer.html',
            category: 'AI-Powered Tools'
        },
        {
            name: 'AI Essay Writer',
            description: 'Get help writing academic essays and papers.',
            icon: 'bi-file-earmark-text',
            link: '/tools/ai/essay-writer.html',
            category: 'AI-Powered Tools'
        },
        {
            name: 'AI Translation Tool',
            description: 'Translate text between multiple languages using AI.',
            icon: 'bi-translate',
            link: '/tools/ai/translator.html',
            category: 'AI-Powered Tools'
        }
    ],
    imageTools: [
        {
            name: 'JPG to PNG Converter',
            description: 'Convert JPG images to PNG format easily.',
            icon: 'bi-arrow-left-right',
            link: '/tools/image/jpg-to-png.html',
            category: 'Image Tools'
        },
        {
            name: 'Image Resizer',
            description: 'Resize images while maintaining quality.',
            icon: 'bi-arrows-angle-expand',
            link: '/tools/image/image-resizer.html',
            category: 'Image Tools'
        },
        {
            name: 'Image Compressor',
            description: 'Compress images without losing quality.',
            icon: 'bi-file-zip',
            link: '/tools/image/image-compressor.html',
            category: 'Image Tools'
        },
        {
            name: 'Image Cropper',
            description: 'Crop and adjust image dimensions easily.',
            icon: 'bi-crop',
            link: '/tools/image/image-cropper.html',
            category: 'Image Tools'
        },
        {
            name: 'Image to Base64',
            description: 'Convert images to Base64 string format.',
            icon: 'bi-code',
            link: '/tools/image/image-to-base64.html',
            category: 'Image Tools'
        },
        {
            name: 'WebP to PNG Converter',
            description: 'Convert WebP images to PNG format.',
            icon: 'bi-arrow-repeat',
            link: '/tools/image/webp-to-png.html',
            category: 'Image Tools'
        },
        {
            name: 'JPG to WebP Converter',
            description: 'Convert JPG images to WebP format.',
            icon: 'bi-arrow-right',
            link: '/tools/image/jpg-to-webp.html',
            category: 'Image Tools'
        },
        {
            name: 'PNG to WebP Converter',
            description: 'Convert PNG images to WebP format.',
            icon: 'bi-arrow-right-circle',
            link: '/tools/image/png-to-webp.html',
            category: 'Image Tools'
        },
        {
            name: 'HEIC to JPG Converter',
            description: 'Convert HEIC images to JPG format.',
            icon: 'bi-arrow-down-right-circle',
            link: '/tools/image/heic-to-jpg.html',
            category: 'Image Tools'
        },
        {
            name: 'Image to PDF Converter',
            description: 'Convert images to PDF documents.',
            icon: 'bi-file-pdf',
            link: '/tools/image/image-to-pdf.html',
            category: 'Image Tools'
        },
        {
            name: 'Background Remover',
            description: 'Remove image backgrounds automatically.',
            icon: 'bi-scissors',
            link: '/tools/image/background-remover.html',
            category: 'Image Tools'
        },
        {
            name: 'Watermark Remover',
            description: 'Remove watermarks from images.',
            icon: 'bi-x-circle',
            link: '/tools/image/watermark-remover.html',
            category: 'Image Tools'
        },
        {
            name: 'Image Sharpener',
            description: 'Enhance image sharpness and clarity.',
            icon: 'bi-brightness-high',
            link: '/tools/image/image-sharpener.html',
            category: 'Image Tools'
        },
        {
            name: 'Screenshot to PDF',
            description: 'Convert screenshots to PDF format.',
            icon: 'bi-camera',
            link: '/tools/image/screenshot-to-pdf.html',
            category: 'Image Tools'
        },
        {
            name: 'Image Color Picker',
            description: 'Extract colors from any image.',
            icon: 'bi-eyedropper',
            link: '/tools/image/color-picker.html',
            category: 'Image Tools'
        }
    ],
    seoTools: [
        {
            name: 'Meta Tag Generator',
            description: 'Generate SEO-friendly meta tags for your website.',
            icon: 'bi-tags',
            link: '/tools/seo/meta-tag-generator.html',
            category: 'SEO Tools'
        },
        {
            name: 'Meta Tag Analyzer',
            description: 'Analyze and optimize your meta tags.',
            icon: 'bi-search',
            link: '/tools/seo/meta-tag-analyzer.html',
            category: 'SEO Tools'
        },
        {
            name: 'Title Tag Checker',
            description: 'Check and optimize your title tags.',
            icon: 'bi-type-h1',
            link: '/tools/seo/title-tag-checker.html',
            category: 'SEO Tools'
        },
        {
            name: 'Robots.txt Generator',
            description: 'Create and validate robots.txt files.',
            icon: 'bi-robot',
            link: '/tools/seo/robots-txt-generator.html',
            category: 'SEO Tools'
        },
        {
            name: 'XML Sitemap Generator',
            description: 'Generate XML sitemaps for your website.',
            icon: 'bi-diagram-3',
            link: '/tools/seo/sitemap-generator.html',
            category: 'SEO Tools'
        },
        {
            name: 'Open Graph Generator',
            description: 'Create Open Graph tags for social sharing.',
            icon: 'bi-share-fill',
            link: '/tools/seo/og-generator.html',
            category: 'SEO Tools'
        },
        {
            name: 'Keyword Density Checker',
            description: 'Analyze keyword usage in your content.',
            icon: 'bi-percent',
            link: '/tools/seo/keyword-density.html',
            category: 'SEO Tools'
        },
        {
            name: 'Heading Tag Checker',
            description: 'Analyze H1-H6 tag structure.',
            icon: 'bi-type',
            link: '/tools/seo/heading-checker.html',
            category: 'SEO Tools'
        },
        {
            name: 'Alt Tag Checker',
            description: 'Check image alt tags for SEO.',
            icon: 'bi-image',
            link: '/tools/seo/alt-tag-checker.html',
            category: 'SEO Tools'
        },
        {
            name: 'Schema Markup Generator',
            description: 'Generate JSON-LD schema markup.',
            icon: 'bi-code-square',
            link: '/tools/seo/schema-generator.html',
            category: 'SEO Tools'
        },
        {
            name: 'Keyword Suggestion Tool',
            description: 'Get keyword ideas for your content.',
            icon: 'bi-lightbulb',
            link: '/tools/seo/keyword-suggestions.html',
            category: 'SEO Tools'
        },
        {
            name: 'Keyword Difficulty Checker',
            description: 'Analyze keyword competition.',
            icon: 'bi-graph-up',
            link: '/tools/seo/keyword-difficulty.html',
            category: 'SEO Tools'
        },
        {
            name: 'Long Tail Keyword Finder',
            description: 'Find long-tail keyword opportunities.',
            icon: 'bi-search-heart',
            link: '/tools/seo/long-tail-keywords.html',
            category: 'SEO Tools'
        },
        {
            name: 'Trending Keyword Finder',
            description: 'Discover trending keywords.',
            icon: 'bi-graph-up-arrow',
            link: '/tools/seo/trending-keywords.html',
            category: 'SEO Tools'
        },
        {
            name: 'Broken Link Checker',
            description: 'Find and fix broken links.',
            icon: 'bi-link-45deg',
            link: '/tools/seo/broken-link-checker.html',
            category: 'SEO Tools'
        }
    ],
    pdfTools: [
        {
            name: 'JPG to PDF',
            description: 'Convert JPG images to PDF format.',
            icon: 'bi-file-earmark-pdf',
            link: '/tools/pdf/jpg-to-pdf.html',
            category: 'PDF Tools'
        },
        {
            name: 'Word to PDF',
            description: 'Convert Word documents to PDF format.',
            icon: 'bi-file-word',
            link: '/tools/pdf/word-to-pdf.html',
            category: 'PDF Tools'
        },
        {
            name: 'PowerPoint to PDF',
            description: 'Convert PowerPoint presentations to PDF.',
            icon: 'bi-file-ppt',
            link: '/tools/pdf/ppt-to-pdf.html',
            category: 'PDF Tools'
        },
        {
            name: 'Excel to PDF',
            description: 'Convert Excel spreadsheets to PDF.',
            icon: 'bi-file-excel',
            link: '/tools/pdf/excel-to-pdf.html',
            category: 'PDF Tools'
        },
        {
            name: 'HTML to PDF',
            description: 'Convert web pages to PDF format.',
            icon: 'bi-file-code',
            link: '/tools/pdf/html-to-pdf.html',
            category: 'PDF Tools'
        },
        {
            name: 'PDF to JPG',
            description: 'Convert PDF pages to JPG images.',
            icon: 'bi-file-image',
            link: '/tools/pdf/pdf-to-jpg.html',
            category: 'PDF Tools'
        },
        {
            name: 'PDF to Word',
            description: 'Convert PDF to editable Word documents.',
            icon: 'bi-file-word',
            link: '/tools/pdf/pdf-to-word.html',
            category: 'PDF Tools'
        },
        {
            name: 'PDF to PowerPoint',
            description: 'Convert PDF to PowerPoint presentations.',
            icon: 'bi-file-ppt',
            link: '/tools/pdf/pdf-to-ppt.html',
            category: 'PDF Tools'
        },
        {
            name: 'PDF to Excel',
            description: 'Convert PDF tables to Excel spreadsheets.',
            icon: 'bi-file-excel',
            link: '/tools/pdf/pdf-to-excel.html',
            category: 'PDF Tools'
        },
        {
            name: 'PDF to PDF/A',
            description: 'Convert PDF to PDF/A format for archiving.',
            icon: 'bi-archive',
            link: '/tools/pdf/pdf-to-pdfa.html',
            category: 'PDF Tools'
        },
        {
            name: 'PDF Merge',
            description: 'Combine multiple PDF files into one.',
            icon: 'bi-file-plus',
            link: '/tools/pdf/pdf-merge.html',
            category: 'PDF Tools'
        },
        {
            name: 'PDF Split',
            description: 'Split PDF files into multiple documents.',
            icon: 'bi-file-minus',
            link: '/tools/pdf/pdf-split.html',
            category: 'PDF Tools'
        },
        {
            name: 'PDF Rotate',
            description: 'Rotate PDF pages to any angle.',
            icon: 'bi-arrow-clockwise',
            link: '/tools/pdf/pdf-rotate.html',
            category: 'PDF Tools'
        },
        {
            name: 'PDF Unlock',
            description: 'Remove password protection from PDF files.',
            icon: 'bi-unlock',
            link: '/tools/pdf/pdf-unlock.html',
            category: 'PDF Tools'
        },
        {
            name: 'PDF Crop',
            description: 'Crop PDF pages to desired dimensions.',
            icon: 'bi-crop',
            link: '/tools/pdf/pdf-crop.html',
            category: 'PDF Tools'
        }
    ],
    calculatorTools: [
        {
            name: 'Percentage Calculator',
            description: 'Calculate percentages and percentage changes.',
            icon: 'bi-percent',
            link: '/tools/calculators/percentage.html',
            category: 'Calculator Tools'
        },
        {
            name: 'Age Calculator',
            description: 'Calculate age between two dates.',
            icon: 'bi-calendar',
            link: '/tools/calculators/age.html',
            category: 'Calculator Tools'
        },
        {
            name: 'BMI Calculator',
            description: 'Calculate Body Mass Index (BMI).',
            icon: 'bi-person',
            link: '/tools/calculators/bmi.html',
            category: 'Calculator Tools'
        },
        {
            name: 'Loan EMI Calculator',
            description: 'Calculate loan EMI payments.',
            icon: 'bi-cash',
            link: '/tools/calculators/loan-emi.html',
            category: 'Calculator Tools'
        },
        {
            name: 'Scientific Calculator',
            description: 'Advanced scientific calculations.',
            icon: 'bi-calculator',
            link: '/tools/calculators/scientific.html',
            category: 'Calculator Tools'
        },
        {
            name: 'Discount Calculator',
            description: 'Calculate discounts and final prices.',
            icon: 'bi-tag',
            link: '/tools/calculators/discount.html',
            category: 'Calculator Tools'
        },
        {
            name: 'Currency Converter',
            description: 'Convert between different currencies.',
            icon: 'bi-currency-exchange',
            link: '/tools/calculators/currency.html',
            category: 'Calculator Tools'
        },
        {
            name: 'Time Zone Converter',
            description: 'Convert time between different zones.',
            icon: 'bi-clock',
            link: '/tools/calculators/timezone.html',
            category: 'Calculator Tools'
        },
        {
            name: 'Savings Calculator',
            description: 'Calculate savings and interest growth.',
            icon: 'bi-piggy-bank',
            link: '/tools/calculators/savings.html',
            category: 'Calculator Tools'
        },
        {
            name: 'Retirement Calculator',
            description: 'Plan your retirement savings.',
            icon: 'bi-house',
            link: '/tools/calculators/retirement.html',
            category: 'Calculator Tools'
        },
        {
            name: 'Length Converter',
            description: 'Convert between length units.',
            icon: 'bi-rulers',
            link: '/tools/calculators/length.html',
            category: 'Calculator Tools'
        },
        {
            name: 'Volume Converter',
            description: 'Convert between volume units.',
            icon: 'bi-box',
            link: '/tools/calculators/volume.html',
            category: 'Calculator Tools'
        },
        {
            name: 'Speed Converter',
            description: 'Convert between speed units.',
            icon: 'bi-speedometer',
            link: '/tools/calculators/speed.html',
            category: 'Calculator Tools'
        },
        {
            name: 'Binary Calculator',
            description: 'Convert between number systems.',
            icon: 'bi-code-slash',
            link: '/tools/calculators/binary.html',
            category: 'Calculator Tools'
        },
        {
            name: 'Tip Calculator',
            description: 'Calculate tips and split bills.',
            icon: 'bi-receipt',
            link: '/tools/calculators/tip.html',
            category: 'Calculator Tools'
        }
    ],
    textTools: [
        {
            name: 'Word Counter',
            description: 'Count words, characters, and paragraphs.',
            icon: 'bi-123',
            link: '/tools/text/word-counter.html',
            category: 'Text Tools'
        },
        {
            name: 'Character Counter',
            description: 'Count characters with and without spaces.',
            icon: 'bi-fonts',
            link: '/tools/text/character-counter.html',
            category: 'Text Tools'
        },
        {
            name: 'Case Converter',
            description: 'Convert text case (upper, lower, title).',
            icon: 'bi-type',
            link: '/tools/text/case-converter.html',
            category: 'Text Tools'
        },
        {
            name: 'Plagiarism Checker',
            description: 'Check text for potential plagiarism.',
            icon: 'bi-shield-check',
            link: '/tools/text/plagiarism-checker.html',
            category: 'Text Tools'
        },
        {
            name: 'Grammar Checker',
            description: 'Check and correct grammar errors.',
            icon: 'bi-check-square',
            link: '/tools/text/grammar-checker.html',
            category: 'Text Tools'
        },
        {
            name: 'Text to Speech',
            description: 'Convert text to natural speech.',
            icon: 'bi-volume-up',
            link: '/tools/text/text-to-speech.html',
            category: 'Text Tools'
        },
        {
            name: 'Speech to Text',
            description: 'Convert speech to written text.',
            icon: 'bi-mic',
            link: '/tools/text/speech-to-text.html',
            category: 'Text Tools'
        },
        {
            name: 'URL Encoder/Decoder',
            description: 'Encode and decode URLs.',
            icon: 'bi-link-45deg',
            link: '/tools/text/url-encoder.html',
            category: 'Text Tools'
        },
        {
            name: 'Fancy Text Generator',
            description: 'Create stylized text for social media.',
            icon: 'bi-stars',
            link: '/tools/text/fancy-text.html',
            category: 'Text Tools'
        },
        {
            name: 'Random Text Generator',
            description: 'Generate random text and lorem ipsum.',
            icon: 'bi-shuffle',
            link: '/tools/text/random-text.html',
            category: 'Text Tools'
        },
        {
            name: 'Text Rewriter',
            description: 'Paraphrase and rewrite content.',
            icon: 'bi-pencil-square',
            link: '/tools/text/text-rewriter.html',
            category: 'Text Tools'
        },
        {
            name: 'HTML Encode/Decode',
            description: 'Convert text to/from HTML entities.',
            icon: 'bi-code-slash',
            link: '/tools/text/html-encoder.html',
            category: 'Text Tools'
        },
        {
            name: 'Dummy Text Generator',
            description: 'Generate placeholder text for designs.',
            icon: 'bi-file-text',
            link: '/tools/text/dummy-text.html',
            category: 'Text Tools'
        },
        {
            name: 'Morse Code Translator',
            description: 'Convert text to/from Morse code.',
            icon: 'bi-dot',
            link: '/tools/text/morse-code.html',
            category: 'Text Tools'
        },
        {
            name: 'Text Diff Checker',
            description: 'Compare and find differences in text.',
            icon: 'bi-file-diff',
            link: '/tools/text/diff-checker.html',
            category: 'Text Tools'
        }
    ],
    developerTools: [
        {
            name: 'JSON Formatter',
            description: 'Format and validate JSON data.',
            icon: 'bi-braces',
            link: '/tools/developer/json-formatter.html',
            category: 'Developer Tools'
        },
        {
            name: 'HTML Formatter',
            description: 'Format and beautify HTML code.',
            icon: 'bi-code-square',
            link: '/tools/developer/html-formatter.html',
            category: 'Developer Tools'
        },
        {
            name: 'CSS Minifier',
            description: 'Minify CSS code to reduce file size.',
            icon: 'bi-file-code',
            link: '/tools/developer/css-minifier.html',
            category: 'Developer Tools'
        },
        {
            name: 'JavaScript Minifier',
            description: 'Minify JavaScript code for production.',
            icon: 'bi-file-earmark-code',
            link: '/tools/developer/js-minifier.html',
            category: 'Developer Tools'
        },
        {
            name: 'Code Diff Checker',
            description: 'Compare and find differences in code.',
            icon: 'bi-file-diff',
            link: '/tools/developer/code-diff.html',
            category: 'Developer Tools'
        },
        {
            name: 'RegEx Tester',
            description: 'Test and validate regular expressions.',
            icon: 'bi-regex',
            link: '/tools/developer/regex-tester.html',
            category: 'Developer Tools'
        },
        {
            name: 'Base64 Encoder/Decoder',
            description: 'Encode and decode Base64 strings.',
            icon: 'bi-box-arrow-in-down',
            link: '/tools/developer/base64.html',
            category: 'Developer Tools'
        },
        {
            name: 'JWT Debugger',
            description: 'Debug and verify JWT tokens.',
            icon: 'bi-key',
            link: '/tools/developer/jwt-debugger.html',
            category: 'Developer Tools'
        },
        {
            name: 'Hash Generator',
            description: 'Generate MD5, SHA-1, SHA-256 hashes.',
            icon: 'bi-hash',
            link: '/tools/developer/hash-generator.html',
            category: 'Developer Tools'
        },
        {
            name: 'Color Converter',
            description: 'Convert between color formats.',
            icon: 'bi-palette',
            link: '/tools/developer/color-converter.html',
            category: 'Developer Tools'
        },
        {
            name: 'Cron Expression Generator',
            description: 'Generate and validate cron expressions.',
            icon: 'bi-clock-history',
            link: '/tools/developer/cron-generator.html',
            category: 'Developer Tools'
        },
        {
            name: 'SQL Formatter',
            description: 'Format and beautify SQL queries.',
            icon: 'bi-database',
            link: '/tools/developer/sql-formatter.html',
            category: 'Developer Tools'
        },
        {
            name: 'XML Formatter',
            description: 'Format and validate XML documents.',
            icon: 'bi-file-earmark-text',
            link: '/tools/developer/xml-formatter.html',
            category: 'Developer Tools'
        },
        {
            name: 'API Tester',
            description: 'Test REST API endpoints.',
            icon: 'bi-hdd-network',
            link: '/tools/developer/api-tester.html',
            category: 'Developer Tools'
        },
        {
            name: 'Code Snippet Generator',
            description: 'Generate common code snippets.',
            icon: 'bi-code-slash',
            link: '/tools/developer/snippet-generator.html',
            category: 'Developer Tools'
        }
    ],
    unitConverters: [
        {
            name: 'Length Converter',
            description: 'Convert between different length units.',
            icon: 'bi-rulers',
            link: '/tools/converters/length.html',
            category: 'Unit Converters'
        },
        {
            name: 'Weight Converter',
            description: 'Convert between different weight units.',
            icon: 'bi-box-seam',
            link: '/tools/converters/weight.html',
            category: 'Unit Converters'
        },
        {
            name: 'Temperature Converter',
            description: 'Convert between temperature scales.',
            icon: 'bi-thermometer-half',
            link: '/tools/converters/temperature.html',
            category: 'Unit Converters'
        },
        {
            name: 'Area Converter',
            description: 'Convert between area measurements.',
            icon: 'bi-square',
            link: '/tools/converters/area.html',
            category: 'Unit Converters'
        },
        {
            name: 'Volume Converter',
            description: 'Convert between volume units.',
            icon: 'bi-box',
            link: '/tools/converters/volume.html',
            category: 'Unit Converters'
        },
        {
            name: 'Speed Converter',
            description: 'Convert between speed units.',
            icon: 'bi-speedometer2',
            link: '/tools/converters/speed.html',
            category: 'Unit Converters'
        },
        {
            name: 'Time Converter',
            description: 'Convert between time units.',
            icon: 'bi-clock',
            link: '/tools/converters/time.html',
            category: 'Unit Converters'
        },
        {
            name: 'Digital Storage',
            description: 'Convert between digital storage units.',
            icon: 'bi-hdd',
            link: '/tools/converters/digital-storage.html',
            category: 'Unit Converters'
        },
        {
            name: 'Pressure Converter',
            description: 'Convert between pressure units.',
            icon: 'bi-arrow-down-up',
            link: '/tools/converters/pressure.html',
            category: 'Unit Converters'
        },
        {
            name: 'Energy Converter',
            description: 'Convert between energy units.',
            icon: 'bi-lightning',
            link: '/tools/converters/energy.html',
            category: 'Unit Converters'
        },
        {
            name: 'Power Converter',
            description: 'Convert between power units.',
            icon: 'bi-plug',
            link: '/tools/converters/power.html',
            category: 'Unit Converters'
        },
        {
            name: 'Angle Converter',
            description: 'Convert between angle measurements.',
            icon: 'bi-triangle',
            link: '/tools/converters/angle.html',
            category: 'Unit Converters'
        },
        {
            name: 'Frequency Converter',
            description: 'Convert between frequency units.',
            icon: 'bi-wave',
            link: '/tools/converters/frequency.html',
            category: 'Unit Converters'
        },
        {
            name: 'Fuel Economy',
            description: 'Convert between fuel economy units.',
            icon: 'bi-fuel-pump',
            link: '/tools/converters/fuel-economy.html',
            category: 'Unit Converters'
        },
        {
            name: 'Currency Converter',
            description: 'Convert between world currencies.',
            icon: 'bi-currency-exchange',
            link: '/tools/converters/currency.html',
            category: 'Unit Converters'
        }
    ],
    socialMediaTools: [
        {
            name: 'Social Media Image Resizer',
            description: 'Resize images for different social media platforms.',
            icon: 'bi-image',
            link: '/tools/social/image-resizer.html',
            category: 'Social Media Tools'
        },
        {
            name: 'Instagram Bio Link Generator',
            description: 'Create custom bio links for Instagram.',
            icon: 'bi-instagram',
            link: '/tools/social/bio-link.html',
            category: 'Social Media Tools'
        },
        {
            name: 'Hashtag Generator',
            description: 'Generate relevant hashtags for your content.',
            icon: 'bi-hash',
            link: '/tools/social/hashtag-generator.html',
            category: 'Social Media Tools'
        },
        {
            name: 'Post Scheduler',
            description: 'Schedule posts for different time zones.',
            icon: 'bi-calendar-event',
            link: '/tools/social/post-scheduler.html',
            category: 'Social Media Tools'
        },
        {
            name: 'Caption Generator',
            description: 'Generate engaging captions for posts.',
            icon: 'bi-chat-quote',
            link: '/tools/social/caption-generator.html',
            category: 'Social Media Tools'
        },
        {
            name: 'Profile Picture Maker',
            description: 'Create and edit profile pictures.',
            icon: 'bi-person-circle',
            link: '/tools/social/profile-picture.html',
            category: 'Social Media Tools'
        },
        {
            name: 'Social Color Picker',
            description: 'Find and save brand color schemes.',
            icon: 'bi-palette',
            link: '/tools/social/color-picker.html',
            category: 'Social Media Tools'
        },
        {
            name: 'Engagement Calculator',
            description: 'Calculate social media engagement rates.',
            icon: 'bi-graph-up',
            link: '/tools/social/engagement-calculator.html',
            category: 'Social Media Tools'
        },
        {
            name: 'Story Cover Maker',
            description: 'Create Instagram story highlight covers.',
            icon: 'bi-collection',
            link: '/tools/social/story-cover.html',
            category: 'Social Media Tools'
        },
        {
            name: 'Video Trimmer',
            description: 'Trim videos for social media posts.',
            icon: 'bi-film',
            link: '/tools/social/video-trimmer.html',
            category: 'Social Media Tools'
        },
        {
            name: 'Watermark Maker',
            description: 'Add watermarks to your content.',
            icon: 'bi-badge-tm',
            link: '/tools/social/watermark.html',
            category: 'Social Media Tools'
        },
        {
            name: 'Analytics Tool',
            description: 'Analyze social media performance.',
            icon: 'bi-bar-chart',
            link: '/tools/social/analytics.html',
            category: 'Social Media Tools'
        },
        {
            name: 'Bio Link Tree',
            description: 'Create a custom bio link tree.',
            icon: 'bi-diagram-3',
            link: '/tools/social/link-tree.html',
            category: 'Social Media Tools'
        },
        {
            name: 'Banner Maker',
            description: 'Create banners for social profiles.',
            icon: 'bi-window',
            link: '/tools/social/banner-maker.html',
            category: 'Social Media Tools'
        },
        {
            name: 'Content Calendar',
            description: 'Generate content posting schedules.',
            icon: 'bi-calendar4-week',
            link: '/tools/social/content-calendar.html',
            category: 'Social Media Tools'
        }
    ],
    utilityTools: [
        {
            name: 'File Renamer',
            description: 'Batch rename files with custom patterns.',
            icon: 'bi-file-earmark-text',
            link: '/tools/utility/file-renamer.html',
            category: 'Utility Tools'
        },
        {
            name: 'Password Generator',
            description: 'Generate strong, secure passwords.',
            icon: 'bi-key',
            link: '/tools/utility/password-generator.html',
            category: 'Utility Tools'
        },
        {
            name: 'QR Code Generator',
            description: 'Create QR codes for text, URLs, or contacts.',
            icon: 'bi-qr-code',
            link: '/tools/utility/qr-generator.html',
            category: 'Utility Tools'
        },
        {
            name: 'File Compressor',
            description: 'Compress files and folders to ZIP format.',
            icon: 'bi-file-zip',
            link: '/tools/utility/file-compressor.html',
            category: 'Utility Tools'
        },
        {
            name: 'File Splitter',
            description: 'Split large files into smaller parts.',
            icon: 'bi-scissors',
            link: '/tools/utility/file-splitter.html',
            category: 'Utility Tools'
        },
        {
            name: 'File Merger',
            description: 'Combine multiple files into one.',
            icon: 'bi-file-plus',
            link: '/tools/utility/file-merger.html',
            category: 'Utility Tools'
        },
        {
            name: 'Duplicate File Finder',
            description: 'Find and remove duplicate files.',
            icon: 'bi-files',
            link: '/tools/utility/duplicate-finder.html',
            category: 'Utility Tools'
        },
        {
            name: 'File Checksum',
            description: 'Calculate MD5, SHA-1, SHA-256 checksums.',
            icon: 'bi-shield-check',
            link: '/tools/utility/file-checksum.html',
            category: 'Utility Tools'
        },
        {
            name: 'Random Number Generator',
            description: 'Generate random numbers and sequences.',
            icon: 'bi-dice-5',
            link: '/tools/utility/random-generator.html',
            category: 'Utility Tools'
        },
        {
            name: 'UUID Generator',
            description: 'Generate unique identifiers (UUIDs).',
            icon: 'bi-fingerprint',
            link: '/tools/utility/uuid-generator.html',
            category: 'Utility Tools'
        },
        {
            name: 'System Information',
            description: 'View detailed system specifications.',
            icon: 'bi-pc-display',
            link: '/tools/utility/system-info.html',
            category: 'Utility Tools'
        },
        {
            name: 'Network Tools',
            description: 'Ping, traceroute, and DNS lookup tools.',
            icon: 'bi-hdd-network',
            link: '/tools/utility/network-tools.html',
            category: 'Utility Tools'
        },
        {
            name: 'Screen Recorder',
            description: 'Record screen activity and audio.',
            icon: 'bi-camera-video',
            link: '/tools/utility/screen-recorder.html',
            category: 'Utility Tools'
        },
        {
            name: 'File Recovery',
            description: 'Recover deleted files and data.',
            icon: 'bi-arrow-counterclockwise',
            link: '/tools/utility/file-recovery.html',
            category: 'Utility Tools'
        },
        {
            name: 'Clipboard Manager',
            description: 'Manage and organize clipboard history.',
            icon: 'bi-clipboard',
            link: '/tools/utility/clipboard-manager.html',
            category: 'Utility Tools'
        }
    ],
    ecommerceTools: [
        {
            name: 'Price Calculator',
            description: 'Calculate profit margins and selling prices.',
            icon: 'bi-calculator',
            link: '/tools/ecommerce/price-calculator.html',
            category: 'E-commerce Tools'
        },
        {
            name: 'Shipping Calculator',
            description: 'Calculate shipping costs and delivery times.',
            icon: 'bi-truck',
            link: '/tools/ecommerce/shipping-calculator.html',
            category: 'E-commerce Tools'
        },
        {
            name: 'Product Description Generator',
            description: 'Generate SEO-friendly product descriptions.',
            icon: 'bi-file-text',
            link: '/tools/ecommerce/description-generator.html',
            category: 'E-commerce Tools'
        },
        {
            name: 'Barcode Generator',
            description: 'Create barcodes for product inventory.',
            icon: 'bi-upc-scan',
            link: '/tools/ecommerce/barcode-generator.html',
            category: 'E-commerce Tools'
        },
        {
            name: 'Invoice Generator',
            description: 'Create professional invoices and receipts.',
            icon: 'bi-receipt',
            link: '/tools/ecommerce/invoice-generator.html',
            category: 'E-commerce Tools'
        },
        {
            name: 'Product Image Optimizer',
            description: 'Optimize product images for e-commerce.',
            icon: 'bi-image',
            link: '/tools/ecommerce/image-optimizer.html',
            category: 'E-commerce Tools'
        },
        {
            name: 'Inventory Tracker',
            description: 'Track and manage product inventory.',
            icon: 'bi-box-seam',
            link: '/tools/ecommerce/inventory-tracker.html',
            category: 'E-commerce Tools'
        },
        {
            name: 'VAT Calculator',
            description: 'Calculate VAT and sales tax amounts.',
            icon: 'bi-percent',
            link: '/tools/ecommerce/vat-calculator.html',
            category: 'E-commerce Tools'
        },
        {
            name: 'Product Feed Generator',
            description: 'Create product feeds for marketplaces.',
            icon: 'bi-diagram-3',
            link: '/tools/ecommerce/feed-generator.html',
            category: 'E-commerce Tools'
        },
        {
            name: 'Return Label Generator',
            description: 'Create return shipping labels.',
            icon: 'bi-arrow-return-left',
            link: '/tools/ecommerce/return-label.html',
            category: 'E-commerce Tools'
        },
        {
            name: 'Order Tracker',
            description: 'Track orders and shipping status.',
            icon: 'bi-geo',
            link: '/tools/ecommerce/order-tracker.html',
            category: 'E-commerce Tools'
        },
        {
            name: 'Bulk Price Updater',
            description: 'Update multiple product prices at once.',
            icon: 'bi-tags',
            link: '/tools/ecommerce/bulk-price-updater.html',
            category: 'E-commerce Tools'
        },
        {
            name: 'Marketplace Price Tracker',
            description: 'Monitor competitor prices across marketplaces.',
            icon: 'bi-graph-up',
            link: '/tools/ecommerce/price-tracker.html',
            category: 'E-commerce Tools'
        },
        {
            name: 'Product Review Generator',
            description: 'Generate review request emails.',
            icon: 'bi-star',
            link: '/tools/ecommerce/review-generator.html',
            category: 'E-commerce Tools'
        },
        {
            name: 'Sales Tax Calculator',
            description: 'Calculate sales tax for different regions.',
            icon: 'bi-cash-stack',
            link: '/tools/ecommerce/sales-tax.html',
            category: 'E-commerce Tools'
        }
    ]
};

// Function to create a tool card
function createToolCard(tool) {
    return `
        <div class="col-md-4 col-lg-3 mb-4">
            <div class="tool-card">
                <div class="tool-icon mb-3">
                    <i class="bi ${tool.icon} fs-1"></i>
                </div>
                <h3 class="tool-name h5 mb-2">${tool.name}</h3>
                <p class="tool-description mb-3">${tool.description}</p>
                <a href="${tool.link}" class="btn btn-primary btn-sm">Use Tool</a>
                <div class="tool-category mt-2">
                    <small class="text-muted">${tool.category}</small>
                </div>
            </div>
        </div>
    `;
}

// Function to render tools in their respective sections
function renderTools() {
    // Render AI Tools
    const aiToolsGrid = document.getElementById('ai-tools-grid');
    if (aiToolsGrid) {
        aiToolsGrid.innerHTML = toolsData.aiTools.map(tool => createToolCard(tool)).join('');
    }

    // Render Image Tools
    const imageToolsGrid = document.getElementById('image-tools-grid');
    if (imageToolsGrid) {
        imageToolsGrid.innerHTML = toolsData.imageTools.map(tool => createToolCard(tool)).join('');
    }

    // Render SEO Tools
    const seoToolsGrid = document.getElementById('seo-tools-grid');
    if (seoToolsGrid) {
        seoToolsGrid.innerHTML = toolsData.seoTools.map(tool => createToolCard(tool)).join('');
    }

    // Render PDF Tools
    const pdfToolsGrid = document.getElementById('pdf-tools-grid');
    if (pdfToolsGrid) {
        pdfToolsGrid.innerHTML = toolsData.pdfTools.map(tool => createToolCard(tool)).join('');
    }

    // Render Calculator Tools
    const calculatorToolsGrid = document.getElementById('calculator-tools-grid');
    if (calculatorToolsGrid) {
        calculatorToolsGrid.innerHTML = toolsData.calculatorTools.map(tool => createToolCard(tool)).join('');
    }

    // Render Text Tools
    const textToolsGrid = document.getElementById('text-tools-grid');
    if (textToolsGrid) {
        textToolsGrid.innerHTML = toolsData.textTools.map(tool => createToolCard(tool)).join('');
    }

    // Render Developer Tools
    const developerToolsGrid = document.getElementById('developer-tools-grid');
    if (developerToolsGrid) {
        developerToolsGrid.innerHTML = toolsData.developerTools.map(tool => createToolCard(tool)).join('');
    }

    // Render Unit Converters
    const unitConvertersGrid = document.getElementById('unit-converters-grid');
    if (unitConvertersGrid) {
        unitConvertersGrid.innerHTML = toolsData.unitConverters.map(tool => createToolCard(tool)).join('');
    }

    // Render Social Media Tools
    const socialMediaToolsGrid = document.getElementById('social-media-tools-grid');
    if (socialMediaToolsGrid) {
        socialMediaToolsGrid.innerHTML = toolsData.socialMediaTools.map(tool => createToolCard(tool)).join('');
    }

    // Render Utility Tools
    const utilityToolsGrid = document.getElementById('utility-tools-grid');
    if (utilityToolsGrid) {
        utilityToolsGrid.innerHTML = toolsData.utilityTools.map(tool => createToolCard(tool)).join('');
    }

    // Render E-commerce Tools
    const ecommerceToolsGrid = document.getElementById('ecommerce-tools-grid');
    if (ecommerceToolsGrid) {
        ecommerceToolsGrid.innerHTML = toolsData.ecommerceTools.map(tool => createToolCard(tool)).join('');
    }
}

// Initialize tools when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderTools();
    
    // Add Bootstrap icons CSS
    const iconsCss = document.createElement('link');
    iconsCss.rel = 'stylesheet';
    iconsCss.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css';
    document.head.appendChild(iconsCss);
}); 