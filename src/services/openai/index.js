const { Configuration, OpenAIApi } = require("openai");
const { OPENAI_API_KEY } = require("../../utils/config");

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const createChatCompletion = async prompt => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt
        }
      ]
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(error.response.status);
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

module.exports = { createChatCompletion };
