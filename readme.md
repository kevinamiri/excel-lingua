# OpenAI Translation with Excel file and TypeScript

This TypeScript application reads source language texts from an Excel file, translates them using the OpenAI API, and updates the target language texts and total tokens in the Excel file. It keeps track of the total number of tokens and manage it if the limit would be exceeded. The translation requests are sent with a retry mechanism to handle rate limit errors.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed Node.js and npm.
* You have a basic understanding of TypeScript.
* You have a OpenAI API key.

## Installing Dependencies

To install the necessary dependencies, run the following command:

```bash
npm install xlsx axios gpt-tokenizer openai dotenv
```

## Setting Up

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

Replace `index.ts` with the name of your TypeScript file if it's different.


## TO-DO List

- convert Write operation into append operation on every change in file



## Contributing to the Project

To contribute to this project, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

## Contact

If you want to contact me, you can reach me at `<your_email>`.

## License

This project uses the following license: `<license_name>`.

---

You can replace `<your_email>` and `<license_name>` with your actual email and the license you're using for the project.