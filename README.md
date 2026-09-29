# 🌍 Language Translation Tool

A simple and user-friendly **Language Translation Tool** that allows users to enter text, select a source language and target language, and instantly translate the text using a translation API.

The application can be extended with features such as **copy-to-clipboard** and **text-to-speech**, making it useful for communication, learning, travel, and multilingual applications.

---

## 📌 Project Overview

Language barriers can make communication difficult when people speak different languages. This project provides a simple interface where users can enter text and translate it into their preferred language.

The application communicates with a translation API, receives the translated response, and displays it clearly to the user.

### Workflow

```text
User Enters Text
       ↓
Select Source Language
       ↓
Select Target Language
       ↓
Click Translate
       ↓
Translation API
       ↓
Translated Response
       ↓
Display Translation
       ↓
Copy / Text-to-Speech
```

---

## 🎯 Objectives

* Create a simple and intuitive translation interface.
* Allow users to enter text for translation.
* Provide source-language selection.
* Provide target-language selection.
* Send translation requests to an external API.
* Receive and process the translated response.
* Display translated text clearly.
* Add copy-to-clipboard functionality.
* Optionally provide text-to-speech output.

---

## 🛠️ Technologies Used

* **HTML**
* **CSS**
* **JavaScript**
* **Translation API**
* **REST API**
* **JSON**
* **Web Speech API** *(optional)*

Depending on the implementation, the project can use:

* Google Cloud Translation API
* Microsoft Translator API
* Another compatible translation service

---

## 🧠 System Architecture

```text
             User Interface
                   ↓
          Enter Text + Languages
                   ↓
             JavaScript
                   ↓
            API Request
                   ↓
        Translation Service
                   ↓
           JSON Response
                   ↓
       Extract Translated Text
                   ↓
          Display Translation
             ↙          ↘
          Copy       Text-to-Speech
```

---

## 📂 Project Structure

```text
Language-Translation-Tool/
│
├── index.html
├── style.css
├── script.js
│
├── assets/
│   └── icons/
│
├── README.md
└── .gitignore
```

---

## 🖥️ User Interface

The application contains:

### Input Section

* Text input area
* Source language dropdown
* Target language dropdown

### Translation Section

* Translate button
* Loading indicator
* Translated text display

### Additional Controls

* 📋 Copy button
* 🔊 Text-to-speech button
* 🔄 Swap languages *(optional)*

Example interface:

```text
┌──────────────────────────────────────────┐
│          LANGUAGE TRANSLATOR             │
├──────────────────────────────────────────┤
│                                          │
│  Source Language                         │
│  [ English ▼ ]                           │
│                                          │
│  Enter text:                             │
│  ┌────────────────────────────────────┐  │
│  │ Hello, how are you?                │  │
│  └────────────────────────────────────┘  │
│                                          │
│              [ Translate ]               │
│                                          │
│  Target Language                         │
│  [ Tamil ▼ ]                             │
│                                          │
│  Translation:                            │
│  ┌────────────────────────────────────┐  │
│  │ வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்? │  │
│  └────────────────────────────────────┘  │
│                                          │
│       [ Copy ]       [ 🔊 Listen ]       │
└──────────────────────────────────────────┘
```

---

## 🌐 Supported Languages

The available languages depend on the selected translation API.

Examples include:

| Language  | Code |
| --------- | ---- |
| English   | `en` |
| Tamil     | `ta` |
| Kannada   | `kn` |
| Hindi     | `hi` |
| Telugu    | `te` |
| Malayalam | `ml` |
| Spanish   | `es` |
| French    | `fr` |
| German    | `de` |
| Japanese  | `ja` |
| Korean    | `ko` |
| Chinese   | `zh` |

---

## 🔑 Translation API

The application sends the user's text to a translation service using an HTTP request.

General request flow:

```text
Application
     ↓
API Request
     ↓
Translation Server
     ↓
Translation Processing
     ↓
JSON Response
     ↓
Application
```

The response typically contains the translated text along with additional information depending on the API.

---

## 💻 Basic JavaScript Example

The following demonstrates the general structure of making a translation request.

```javascript
async function translateText() {

    const text = document.getElementById("inputText").value;
    const sourceLanguage =
        document.getElementById("sourceLanguage").value;
    const targetLanguage =
        document.getElementById("targetLanguage").value;

    if (!text.trim()) {
        alert("Please enter some text.");
        return;
    }

    try {

        const response = await fetch("YOUR_TRANSLATION_API_URL", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: text,
                source: sourceLanguage,
                target: targetLanguage
            })
        });

        const data = await response.json();

        document.getElementById("outputText").value =
            data.translation;

    } catch (error) {

        console.error(error);

        alert("Translation failed. Please try again.");
    }
}
```

> The exact request format depends on the translation API being used.

---

## 📋 Copy Translation

A copy button can allow users to quickly copy the translated text.

```javascript
function copyTranslation() {

    const output =
        document.getElementById("outputText");

    navigator.clipboard.writeText(output.value);

    alert("Translation copied!");
}
```

This makes it easy to paste the translated content into another application.

---

## 🔊 Text-to-Speech

The browser's Web Speech API can optionally be used to read the translated text aloud.

```javascript
function speakTranslation() {

    const text =
        document.getElementById("outputText").value;

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    window.speechSynthesis.speak(speech);
}
```

The speech language should be changed according to the selected target language.

---

## 🔄 Language Swap

An optional swap button can exchange the source and target languages.

```javascript
function swapLanguages() {

    const source =
        document.getElementById("sourceLanguage");

    const target =
        document.getElementById("targetLanguage");

    const temporary = source.value;

    source.value = target.value;
    target.value = temporary;
}
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Language-Translation-Tool.git
```

### 2. Navigate to the project

```bash
cd Language-Translation-Tool
```

### 3. Configure the API

Add your translation API credentials according to the provider's documentation.

**Do not commit API keys or other secrets to GitHub.**

Use environment variables or a secure backend when appropriate.

### 4. Run the application

For a simple HTML/CSS/JavaScript implementation, open:

```text
index.html
```

in a browser.

For development, you can also use **VS Code Live Server**.

---

## ▶️ How to Use

1. Open the application.
2. Select the source language.
3. Select the target language.
4. Enter the text you want to translate.
5. Click **Translate**.
6. Wait for the API response.
7. View the translated text.
8. Use **Copy** to copy the result.
9. Use **Listen** to hear the translation if text-to-speech is enabled.

---

## ✨ Features

* 🌍 Multiple language support
* 📝 Text input
* 🔤 Source-language selection
* 🔤 Target-language selection
* ⚡ API-based translation
* 📋 Copy translated text
* 🔊 Text-to-speech
* 🔄 Language swapping
* 📱 Responsive user interface
* ⚠️ Error handling
* ⏳ Translation loading indicator

---

## 🛡️ Error Handling

The application should handle common problems such as:

* Empty input
* Unsupported language
* Invalid API credentials
* Network errors
* API rate limits
* Server errors
* Invalid API responses

Example:

```javascript
if (!response.ok) {
    throw new Error("Translation API request failed");
}
```

---

## 🔐 Security Considerations

API keys should **never be exposed in a public GitHub repository**.

Avoid:

```javascript
const API_KEY = "my-secret-api-key";
```

For production applications, use:

```text
Frontend
   ↓
Your Backend
   ↓
Translation API
```

This helps keep API credentials away from client-side code.

---

## 📊 Example

### Input

```text
Hello, welcome to our application!
```

### Source Language

```text
English
```

### Target Language

```text
Tamil
```

### Output

```text
வணக்கம், எங்கள் பயன்பாட்டிற்கு வரவேற்கிறோம்!
```

---

## 🚀 Future Improvements

* 🎤 Voice input
* 🔊 Improved multilingual text-to-speech
* 📷 Image/text translation using OCR
* 📄 Document translation
* 💬 Conversation translation
* 📴 Offline translation
* 🕘 Translation history
* ⭐ Favorite translations
* 🌐 Automatic language detection
* 📱 Progressive Web App support
* 🤖 AI-powered contextual translation
* 🎨 Dark mode
* 📱 Mobile application version

---

## ⚠️ Limitations

* Translation quality depends on the selected API.
* Internet connectivity is required for cloud-based translation.
* API usage may have quotas or costs.
* Some languages may have limited support.
* Text-to-speech availability depends on browser and language support.
* API credentials must be handled securely.

---

## 📜 License

This project is intended for educational and development purposes.

If a third-party translation API is used, follow the provider's terms of service, API limits, and licensing requirements.

---

## 👨‍💻 Author

**Roys Sudhan B.**

AI/ML Engineering Student
Bengaluru, Karnataka, India

### Interests

* Artificial Intelligence
* Machine Learning
* Generative AI
* Web Development
* Android Development
* Natural Language Processing

---

## ⭐ Acknowledgements

* Translation API provider
* JavaScript
* Web Speech API
* HTML & CSS
* Open-source developer community

---

## 🎯 Project Goal

> **Build a simple and accessible tool that helps users communicate across different languages.**

📝 **Input:** User text
🌐 **Processing:** Translation API
🔤 **Language:** Source → Target
📱 **Output:** Translated text
🔊 **Optional:** Text-to-Speech
