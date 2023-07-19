import { OpenAI } from 'langchain/llms/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import z from 'zod';
import { PromptTemplate } from 'langchain/prompts'
import { Document } from 'langchain/document';
import { loadQARefineChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z.string().describe(
      "the mood of the person who wrote the journal entry."
    ),
    subject: z.string().describe(
      "the subject of the journal entry."
    ),
    summary: z.string().describe(
      "quick summary of the entire entry."
    ),
    negative: z.boolean().describe(
      "is the journal entry negative? (i.e. does it contain negative emotions?)."
    ),
    color: z.string().describe(
      "a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness."
    )
  })
)

const getPrompt = async (content) => {
  const format_instructions = parser.getFormatInstructions();
  // console.log("Formatted instructions: ", format_instructions);
  const template = "Analyze the following journal entry. Folow the instructions and format your \
    response to match the format instructions, no matter what!\n \
    {format_instructions}\n{entry}\
  ".replace( new RegExp("[ ]+", "g"), " ");
  const prompt = new PromptTemplate({
    template,
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({
    entry: content,
  });

  return input;
}

export const analyze = async (content) => {
  const input = await getPrompt(content);
  const model = new OpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
  });
  const result = await model.call( input );
  // result from openai
  try {
    return parser.parse(result);
  } catch (e) {
    console.log( e );
  }
}

export const qa = async (question, entries) => {
  const docs = entries.map(
    (entry) => {
      return new Document({
        pageContent: entry.content,
        metadata: {
          source: entry.id,
          date: entry.createdAt,
        }
      });
    }
  );  // docs is a vector plot
  const model = new OpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
  });
  // chain allows us to chain multiple LLM calls together
  // langchain has many different types of chains, like chat, agent, etc.
  // the QA Refine chane interates over the input docs one by one,
  // updating an intermediate answer with each iteration.
  // it uses the previous version of the answer and the next document
  // as context. It's suitable for QA tasks over a large number of docs.
  const chain = loadQARefineChain( model );
  // store our vectors in memory, use the one langchain has.
  // this returns a function that any chain can use to create embeddings
  // embeddings are a group of vectors.  In this case, it makes an API
  // call to OpenAI to create an embedding.  OpenAI will send us back
  // some vectors.
  const embeddings = new OpenAIEmbeddings();
  // memory vector store:
  const store = await MemoryVectorStore.fromDocuments( docs, embeddings );
  const relavantDocs = await store.similaritySearch( question );
  // now we have the data in the database

  // pass input documents into there
  const res = await chain.call({
    input_documents: relavantDocs,
    question,
  });

  return res.output_text;

}