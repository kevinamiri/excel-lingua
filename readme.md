# Implementation of the Backoff Algorithm for the OpenAI API with Batch Processing and Translation in TypeScript

This repository provides an implementation of the Backoff Algorithm for the OpenAI API, specifically designed for batch processing and translation tasks in TypeScript. The Backoff Algorithm is a crucial component in managing API request rates, ensuring that your application gracefully handles any rate limit errors returned by the OpenAI API. This implementation also leverages the power of GPT-4 for translation tasks and uses XLSX for data management.

## Overview

The Backoff Algorithm is a strategy for managing the rate of requests to an API. When a request is made to the API, if the rate limit has been exceeded, the API will return an error. The Backoff Algorithm handles these errors by progressively increasing the wait time between requests, allowing the application to continue making requests without exceeding the rate limit.

This implementation is designed with batch processing and translation in mind. Batch processing is a technique where API requests are grouped together and processed in batches, rather than individually. This can significantly improve the efficiency and performance of your application when dealing with large volumes of data.

## Features

- **Backoff Algorithm:** This implementation uses the Exponential Backoff Algorithm with Jitter. This algorithm progressively increases the wait time between requests when a rate limit error is encountered, but also introduces a random element (jitter) to prevent synchronization issues.

- **Batch Processing:** This implementation supports batch processing, allowing you to process large volumes of data more efficiently. You can easily adjust the batch size to suit your needs.

- **Translation with GPT-4:** This application uses the OpenAI GPT-4 API for translation tasks. GPT-4 is a powerful language model that can generate high-quality translations.

- **Data Management with XLSX:** Instead of using a database or pandas, this application uses XLSX for data management. This allows for easy and efficient handling of data in Excel format.

- **TypeScript Support:** This implementation is written in TypeScript, providing static typing and other features that can help you write more robust and maintainable code.

## Getting Started

To get started with this implementation, clone the repository and install the necessary dependencies. You will also need to set up your OpenAI API key. Once everything is set up, you can start making requests to the OpenAI API and the Backoff Algorithm will automatically handle any rate limit errors.

Please refer to the repository's README for more detailed instructions on how to use this implementation.

This implementation provides a robust and efficient way to interact with the OpenAI API in TypeScript. Whether you're processing large volumes of data, handling translation tasks, or just want to ensure your application handles rate limit errors gracefully, this implementation has you covered.

### Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed Node.js and npm.
* You have a basic understanding of TypeScript.
* You have a OpenAI API key.

### Installing Node.js and npm
---
Step-by-step guide on how to install Node.js on a Windows system using Node Version Manager (NVM):

1. **Download NVM for Windows:**
   First, you need to download the NVM installation package. You can download it from the official GitHub repository. Here is the link: [NVM for Windows](https://github.com/coreybutler/nvm-windows/releases).

2. **Install NVM:**
   Once the download is complete, click on the downloaded file to start the installation process. Follow the prompts in the installation wizard to complete the installation.

3. **Verify NVM Installation:**
   To verify that NVM was installed correctly, open a new command prompt window and type the following command: `nvm version`. If the installation was successful, this command should return the version of NVM that you installed.

4. **Install Node.js Using NVM:**
   Now that NVM is installed, you can use it to install Node.js. To do this, type the following command in your command prompt: `nvm install <version>`. Replace `<version>` with the version number of Node.js that you want to install. For example, if you want to install Node.js version 14.15.1, you would type `nvm install 14.15.1`.

5. **Verify Node.js Installation:**
   To verify that Node.js was installed correctly, you can use the following command: `node -v`. This command should return the version of Node.js that you installed.

6. **Switch Between Node.js Versions:**
   One of the benefits of using NVM is that it allows you to easily switch between different versions of Node.js. To switch to a different version, you can use the command `nvm use <version>`. Replace `<version>` with the version number of Node.js that you want to switch to.

7. **List Installed Node.js Versions:**
   If you want to see a list of all Node.js versions that you have installed, you can use the command `nvm list`.

Every time you want to use a specific version of Node.js, you need to tell NVM to use that version by typing `nvm use <version>` in your command prompt.

---

### Installing this application

Step-by-step guide on how to install and run a Node.js app from a GitHub repository on a Windows system. In this guide, we'll use a TypeScript repository and run the app using `ts-node` and `npx`.

1. **Clone the Repository:**
   First, you need to clone the repository from GitHub. Open a command prompt, navigate to the directory where you want to clone the repository, and then type the following command: `git clone https://github.com/kevinamiri/excel-lingua`. This will clone the repository into the current directory.

2. **Navigate to the Project Directory:**
   Once the repository is cloned, navigate to the project directory by typing `cd excel-lingua`. This will take you to the project directory.

3. **Install the Project Dependencies:**
   Most Node.js projects have a list of dependencies that need to be installed. These dependencies are listed in the `package.json` file. To install these dependencies, type `npm install` in your command prompt.

4. **Install TypeScript and ts-node Globally:**
   To run TypeScript files directly, you'll need to install TypeScript and ts-node. You can install these globally on your system by typing `npm install -g typescript ts-node` in your command prompt.

5. **Run the App:**
   Now that all the dependencies are installed, you can run the app. If the app's main file is a TypeScript file (`.ts` extension), you can run it using ts-node. Type `ts-node index.ts` in your command prompt.

6. **Using npx:**
   `npx` is a tool that comes with `npm` and helps to run locally installed node modules. It's useful when you want to run a package without installing it globally. If the package is already installed in your project's `node_modules` folder, `npx` will run that version.

   So, if you want to run your TypeScript file with `npx`, you can do so by typing `npx ts-node index.ts` in your command prompt.

---

### Setting Up

Create a `.env` file in the root directory of the project and add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key
```

Replace `your_openai_api_key` with your actual OpenAI API key.

## Running the Application

To run the application, use the following command:

```bash
npx ts-node index.ts
```

## TO-DO List

- Cleaning up the code
- Adjsut the code to be more user-friendly using pre-defined variables to handle the different configuration


## Contact

If you want to contact me, you can reach me by `[maila.ai/en/contact](https://maila.ai/en/contact/)`.

## License

This project uses the following license: `MIT`.
