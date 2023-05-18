
## Step 1. Installing Node.js and npm
---
Step-by-step guide on how to install Node.js on a Windows system using Node Version Manager (NVM):

1. **Download NVM for Windows:**
   First, you need to download the NVM installation package. You can download it from the official GitHub repository.
   
  [NVM for Windows](https://github.com/coreybutler/nvm-windows/releases)

2. **Install NVM:**
   Once the download is complete, click on the downloaded file to start the installation process. Follow the prompts in the installation wizard to complete the installation.

3. **Verify NVM Installation:**
   To verify that NVM was installed correctly, open a new command prompt window and type the following command: `nvm version`. If the installation was successful, this command should return the version of NVM that you installed.

4. **Install Node.js Using NVM:**
   Now that NVM is installed, you can use it to install Node.js. To do this, type the following command in your command prompt: `nvm install <version>`. Replace `<version>` with the version number of Node.js that you want to install. For example, if you want to install Node.js version 19.1.0, you would type `nvm install 19.1.0`.

   ```
   nvm install 19.1.0
   ```

5. **Verify Node.js Installation:**
   To verify that Node.js was installed correctly, you can use the following command: `node -v`. This command should return the version of Node.js that you installed.

   ```
   node -v
   ```

6. **Switch Between Node.js Versions:**
   One of the benefits of using NVM is that it allows you to easily switch between different versions of Node.js. To switch to a different version, you can use the command `nvm use <version>`. Replace `<version>` with the version number of Node.js that you want to switch to.

7. **List Installed Node.js Versions:**
   If you want to see a list of all Node.js versions that you have installed, you can use the command `nvm list`.

Every time you want to use a specific version of Node.js, you need to tell NVM to use that version by typing `nvm use <version>` in your command prompt.

---

## Step 2. Installing this application

Step-by-step guide on how to install and run a Node.js app from a GitHub repository on a Windows system. In this guide, we'll use a TypeScript repository and run the app using `ts-node` and `npx`.

1. **Clone the Repository:**
   First, you need to clone the repository from GitHub. Open a command prompt, navigate to the directory where you want to clone the repository, and then type the following command: `git clone https://github.com/kevinamiri/excel-lingua`. This will clone the repository into the current directory.

```
git clone https://github.com/kevinamiri/excel-lingua
```

2. **Navigate to the Project Directory:**
   Once the repository is cloned, navigate to the project directory by typing `cd excel-lingua`. This will take you to the project directory.

```
cd excel-lingua
```

3. **Install the Project Dependencies:**
   Most Node.js projects have a list of dependencies that need to be installed. These dependencies are listed in the `package.json` file. To install these dependencies, type `npm install` in your command prompt.

```
`npm install`
```

4. **Install TypeScript and ts-node Globally:**
   To run TypeScript files directly, you'll need to install TypeScript and ts-node. You can install these globally on your system by typing `npm install -g typescript ts-node` in your command prompt.

```
npm install -g typescript ts-node
```

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

5. **Run the App:**
   Now that all the dependencies are installed, you can run the app. If the app's main file is a TypeScript file (`.ts` extension), you can run it using ts-node. Type `ts-node index.ts` in your command prompt.

```
ts-node index.ts
```

6. **Using npx:**
   `npx` is a tool that comes with `npm` and helps to run locally installed node modules. It's useful when you want to run a package without installing it globally. If the package is already installed in your project's `node_modules` folder, `npx` will run that version.

   So, if you want to run your TypeScript file with `npx`, you can do so by typing `npx ts-node index.ts` in your command prompt.

```
npx ts-node index.ts
```

## Step 3. Using the application

1. open the `settings.ts` file.
  
  - change the `fileName` variable to the name of your excel file.
  - change the `systemPrompt` variable to your translation prompt or any other prompt you want to use.


2. run the application using the command `npx ts-node index.ts`